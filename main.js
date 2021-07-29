const path = require("path");
const url = require("url");
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
//
const Log = require("./src/models/Log");
const connectDB = require("./src/config/db");
//
//connect to database
connectDB();

let mainWindow;

let isDev = false;
let isMac = process.platform === "darwin" ? true : false;

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  isDev = true;
}

//

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1400 : 1100,
    height: 800,
    show: false,
    icon: `${__dirname}/assets/icon.png`,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  let indexPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open devtools if dev
    if (isDev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

//
app.on("ready", () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(mainMenu);
});

//set template for menu
const template = [
  //{ role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { label: "About", click: () => createAboutWindow() },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  //{ role: 'file' }
  {
    label: "File",
    submenu: [
      isMac
        ? { role: "Close", accelerator: "Command+w" }
        : { role: "Quit", accelerator: "Ctrl+w" },
    ],
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  //
  {
    label: "Logs",
    submenu: [{ label: "Clear logs", click: () => clearLogs() }],
  },
  //{role: 'help'}
  {
    role: "help",
    submenu: isMac
      ? [
          {
            label: "Learn More",
            click: async () => {
              const { shell } = require("electron");
              await shell.openExternal("https://electronjs.org");
            },
          },
        ]
      : [
          {
            label: "Learn More",
            click: async () => {
              const { shell } = require("electron");
              await shell.openExternal("https://electronjs.org");
            },
          },
          { label: "About", click: () => createAboutWindow() },
        ],
  },
];

//load-logs
ipcMain.on("logs:load", (e, opt) => {
  sendLogs();
});

//sendLogs
async function sendLogs() {
  try {
    const logs = await Log.find().sort({ created: 1 });
    mainWindow.webContents.send("logs:get", JSON.stringify(logs));
  } catch (err) {
    console.log(err);
  }
}
//event:add
ipcMain.on("logs:add", async (e, newLog) => {
  try {
    await Log.create(newLog);
    sendLogs();
    //
    mainWindow.webContents.send("logs:success");
    //
  } catch (err) {
    console.log(err);
  }
});

//event:delete
ipcMain.on("logs:delete", async (e, logId) => {
  try {
    await Log.findOneAndDelete({ _id: logId });
    sendLogs();
    mainWindow.webContents.send("logs:removed");
  } catch (err) {
    console.log(err);
  }
});

//clear-logs
async function clearLogs() {
  try {
    await Log.deleteMany({});
    mainWindow.webContents.send("logs:clearAll");
  } catch (err) {
    console.log(err);
  }
}

//
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Stop error
app.allowRendererProcessReuse = true;
