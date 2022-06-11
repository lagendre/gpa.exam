
function openIndexedDB () {
  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  var openDB = indexedDB.open("mygpa", 1);

  openDB.onupgradeneeded = function() {
    var db = {}
    db.result = openDB.result;

    db.store = db.result.createObjectStore('myquiz', {
            autoIncrement: true
        });
	db.index = db.store.createIndex('quiz', 'quiz', {
            unique: false
        });
  };

  return openDB;
}

function getStoreIndexedDB (openDB) {
  var db = {};
  db.result = openDB.result;
  db.tx = db.result.transaction("myquiz", "readwrite");
  db.store = db.tx.objectStore("myquiz");
  db.index = db.store.index("quiz");

  return db;
}

function saveIndexedDB (qa) {
  var openDB = openIndexedDB();

  openDB.onsuccess = function() {
    var db = getStoreIndexedDB(openDB);

    db.store.put(qa);
  }

  return true;
}

function findIndexedDB (filesearch, callback) {
  return loadIndexedDB(null, callback, filesearch);
}

function loadIndexedDB (filename, callback, filesearch) {
  var openDB = openIndexedDB();

  openDB.onsuccess = function() {
    var db = getStoreIndexedDB(openDB);

    var getData;
    if (filename) {
      getData = db.store.get(filename);
    } else {
      getData = db.index.get(filesearch);
    }
    
    getData.onsuccess = function() {
      callback(getData.result.data);
    };

    db.tx.oncomplete = function() {
      db.result.close();
    };
  }

  return true;
}



function getAllquiz(callback) {
	let selcount=0, qadata=[];
	var openDB = openIndexedDB();

	openDB.onsuccess = function() {
		var db = getStoreIndexedDB(openDB);

		var getData = db.store.openCursor();
	
    
		getData.onsuccess = function(evt) {
			let cursor = evt.target.result;
			
			 if (cursor) {
               			let quiz = cursor.value;	
				
				 qadata.push(quiz);
				
				if (Object.keys(quiz.options).length==4)
					selcount++;
                		// continue next record
               		 	cursor.continue();
            		}
			else{
				callback( qadata, selcount);
			}
		};

		db.tx.oncomplete = function() {
		db.result.close();
	};
  }
    return true;
}

function clearquiz() {
    var openDB = openIndexedDB();

	openDB.onsuccess = function() {
	
		var db = getStoreIndexedDB(openDB);

		var clearData = db.store.clear();
		
		clearData.onsuccess = function(evt) {
			alert("錯題已清除!!");
		};
	 
		clearData.onerror = function (evt) {
		console.error("clearquiz:", evt.target.errorCode);
		};
		
		db.tx.oncomplete = function() {
		db.result.close();
		};
  }
}