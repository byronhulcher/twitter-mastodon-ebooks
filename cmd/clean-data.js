const del = require('del'),
  storage = require('node-persist');

function deleteStorageData() {
  storage.initSync();
  storage.clear();
}

async function deleteData() {
  await del('saved-tweets/*.txt');
}

deleteStorageData();
deleteData();