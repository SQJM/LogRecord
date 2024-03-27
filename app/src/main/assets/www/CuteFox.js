if (!window.__CuteFox__) {
    (() => {
        function sendCodeCuteFox(className, name, ...obj) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', window.origin + '/CuteFox', false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            try {
                xhr.send(JSON.stringify({
                    classname: className,
                    name: name,
                    obj: [...obj]
                }));

                if (xhr.status === 200) {
                    const json = JSON.parse(xhr.responseText);
                    if (json.obj.length === 1) {
                        return json.obj[0];
                    } else {
                        return json.obj;
                    }
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error(error);
                return null;
            }
        }
        function generateRandomString(length) {
            const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let result = "";
            for (let i = 0; i < length; i++) {
                const randomChar = chars[Math.floor(Math.random() * chars.length)];
                result += randomChar;
            }
            return result;
        }
        window.__CuteFox__ = {
            Core: {
                invoke: (className, name, ...obj) => {
                    return sendCodeCuteFox(className, name, ...obj);
                }
            },
            _Event: {
                Application: {
                    Exit: () => { return true }
                }
            },
            System:{
                GetSystemInfo: () => {
                    return sendCodeCuteFox("CuteFox_System", "GetSystemInfo");
                },
            },
            Application: {
                Exit: (code) => {
                    if (window.__CuteFox__._Event.Application.Exit()) {
                        setTimeout(() => { window.close() }, 1000);
                        eval(sendCodeCuteFox("CuteFox_Application", "Exit", code));
                    }
                },
                GetCurrentPath: () => {
                    return sendCodeCuteFox("CuteFox_Application", "GetCurrentPath");
                },
                GetClassPath: () => {
                    return sendCodeCuteFox("CuteFox_Application", "GetClassPath");
                },
                GetPackageName: () => {
                    return sendCodeCuteFox("CuteFox_Application", "GetPackageName");
                }
            },
            File: class {
                constructor(path, operation = {
                    isClearFileContent: false,
                    isOverlayFile: false,
                    inexistenceIsCreate: true
                }) {
                    this.FileID = generateRandomString(28);
                    this.path = path;
                    sendCodeCuteFox("CuteFox_File", "AddFile", this.FileID, this.path, [operation.isClearFileContent, operation.isOverlayFile, operation.inexistenceIsCreate]);
                }
                Close() {
                    return sendCodeCuteFox("CuteFox_File", "Close", this.FileID);
                }
                GetLineNumber() {
                    return sendCodeCuteFox("CuteFox_File", "GetLineNumber", this.FileID);
                }
                ReadLine(line) {
                    return sendCodeCuteFox("CuteFox_File", "ReadLine", this.FileID, line);
                }
                ReadAll() {
                    return sendCodeCuteFox("CuteFox_File", "ReadAll", this.FileID);
                }
                Exists() {
                    return sendCodeCuteFox("CuteFox_File", "Exists", this.FileID);
                }
                SetReadOnly() {
                    return sendCodeCuteFox("CuteFox_File", "SetReadOnly", this.FileID);
                }
                SetWritable() {
                    return sendCodeCuteFox("CuteFox_File", "SetWritable", this.FileID);
                }
                Rename(newName) {
                    return sendCodeCuteFox("CuteFox_File", "Rename", this.FileID, newName);
                }
                GetFileInfoList() {
                    return sendCodeCuteFox("CuteFox_File", "GetFileInfoList", this.FileID);
                }
                GetFileList() {
                    return sendCodeCuteFox("CuteFox_File", "GetFileList", this.FileID);
                }
                Copy(targetFolderPath) {
                    return sendCodeCuteFox("CuteFox_File", "Copy", this.FileID, targetFolderPath);
                }
                CreateFolder(path) {
                    return sendCodeCuteFox("CuteFox_File", "CreateFolder", path);
                }
                CreateCurrentFolder(name) {
                    return sendCodeCuteFox("CuteFox_File", "CreateCurrentFolder", this.FileID, name);
                }
                Move(targetFolderPath) {
                    return sendCodeCuteFox("CuteFox_File", "Move", this.FileID, targetFolderPath);
                }
                CreateFile(path) {
                    return sendCodeCuteFox("CuteFox_File", "CreateFile", path);
                }
                CreateCurrentFile(name) {
                    return sendCodeCuteFox("CuteFox_File", "CreateCurrentFile", name);
                }
                Write(content) {
                    return sendCodeCuteFox("CuteFox_File", "Write", this.FileID, content);
                }
                Append(content) {
                    return sendCodeCuteFox("CuteFox_File", "Append", this.FileID, content);
                }
                GetLastModifiedTime() {
                    return sendCodeCuteFox("CuteFox_File", "GetLastModifiedTime", this.FileID);
                }
                GetFileSize() {
                    return sendCodeCuteFox("CuteFox_File", "GetFileSize", this.FileID);
                }
                IsDirectory() {
                    return sendCodeCuteFox("CuteFox_File", "IsDirectory", this.FileID);
                }
                IsFile() {
                    return sendCodeCuteFox("CuteFox_File", "IsFile", this.FileID);
                }
                GetName() {
                    return sendCodeCuteFox("CuteFox_File", "GetName", this.FileID);
                }
                GetAbsolutePath() {
                    return sendCodeCuteFox("CuteFox_File", "GetAbsolutePath", this.FileID);
                }
                GetParent() {
                    return sendCodeCuteFox("CuteFox_File", "GetParent", this.FileID);
                }
                GetPath() {
                    return sendCodeCuteFox("CuteFox_File", "GetPath", this.FileID);
                }
                Delete() {
                    return sendCodeCuteFox("CuteFox_File", "Delete", this.FileID);
                }
            },
            EasyIni: class {
                constructor(filePath, section = null) {
                    this.id = generateRandomString(28);
                    this.path = filePath;
                    this.section = section;
                    sendCodeCuteFox("CuteFox_EasyIni", "Init", this.id, this.path);
                }
                GetKey(key, section = null) {
                    if (section === null) {
                        return sendCodeCuteFox("CuteFox_EasyIni", "GetKey", this.id, this.section, key);
                    }
                    return sendCodeCuteFox("CuteFox_EasyIni", "GetKey", this.id, section, key);
                }
                SetKey(key, value, section = null) {
                    if (section === null) {
                        return sendCodeCuteFox("CuteFox_EasyIni", "SetKey", this.id, this.section, key, value);
                    }
                    return sendCodeCuteFox("CuteFox_EasyIni", "SetKey", this.id, section, key, value);
                }
                RemoveKey(key, section = null) {
                    if (section === null) {
                        return sendCodeCuteFox("CuteFox_EasyIni", "RemoveKey", this.id, this.section, key);
                    }
                    return sendCodeCuteFox("CuteFox_EasyIni", "RemoveKey", this.id, section, key);
                }
                CreateSection(section) {
                    return sendCodeCuteFox("CuteFox_EasyIni", "CreateSection", this.id, section);
                }
                RemoveSection(section) {
                    return sendCodeCuteFox("CuteFox_EasyIni", "RemoveSection", this.id, section);
                }
                Save() {
                    return sendCodeCuteFox("CuteFox_EasyIni", "Save", this.id);
                }
                Close() {
                    return sendCodeCuteFox("CuteFox_EasyIni", "Close", this.id);
                }
            },
            ZipUtils: {
                CompressFile: (filePath, targetPath, password = null) => {
                    return sendCodeCuteFox("CuteFox_ZipUtils", "CompressFile", filePath, targetPath, password);
                },
                CompressFolder: (folderPath, targetPath, password = null) => {
                    return sendCodeCuteFox("CuteFox_ZipUtils", "CompressFolder", folderPath, targetPath, password);
                },
                DecompressFile: (zipFilePath, destFolderPath, password = null) => {
                    return sendCodeCuteFox("CuteFox_ZipUtils", "DecompressFile", zipFilePath, destFolderPath, password);
                },
                ExtractFile: (zipFilePath, destFolderPath, fileName, password = null) => {
                    return sendCodeCuteFox("CuteFox_ZipUtils", "ExtractFile", zipFilePath, destFolderPath, fileName, password);
                },
            },
            HttpUtils: {
                SendGetRequest: (url) => {
                    return sendCodeCuteFox("CuteFox_HttpUtils", "SendGetRequest", url);
                }
            },
            ExternalInteraction: {
                GoBrowser: (url) => {
                    return sendCodeCuteFox("CuteFox_ExternalInteraction", "GoBrowser", url);
                }
            },
            Test: {
                hello: () => {
                    return sendCodeCuteFox("CuteFox_test", "hello");
                }
            }
        }
    })();
}
