const del = require('del'),
  storage = require('node-persist');

function deleteStorageData() {
  storage.initSync();
  storage.clear();
}

async function deleteFileData() {
  await del('saved-tweets/*.txt');
}

function inFiveSeconds() {
  return new Promise( (resolve) => {
    setTimeout(function() {
      resolve();
    }, 5000);
  });
}

async function main(){
  console.log("Clearing data in 5 seconds...")
  await inFiveSeconds();
  deleteFileData();
  deleteStorageData();
  console.log("Data is cleared!");
}

main();