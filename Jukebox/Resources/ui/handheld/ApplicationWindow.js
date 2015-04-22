var platino = require('co.lanica.platino');
// Use platino.require(), not regular require(), to load ALmixer. (platino.require has extra magic)
var ALmixer = platino.require('co.lanica.almixer');

var ALmixer_Initialized = false;

var SUPPORTED_AUDIO_FORMAT = {
	wav:true,
	aac:true,
	m4a:true,
	mp3:true,
	mp4:true,
	ogg:true
};

var getExtention = function(str) {
	var idx = str.lastIndexOf(".");
	if (idx > 0) {
		return str.substring(idx+1);
	} else {
		return str;
	}
};

//Application Window Component Constructor
function ApplicationWindow() {
	var currentPlayingAudioData = null;

	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#222'
	});
	if (Ti.Platform.osname == 'android') {
		self.addEventListener('open', function(e) {
    		self.activity.actionBar.hide();
		});
	}
		
	//construct UI
	var view = Ti.UI.createView({layout:'vertical', top:20, width:Ti.UI.FILL, height:Ti.UI.FILL});
	var headerLabel = Ti.UI.createLabel({text:'Jukebox', color:'#ccc', font: { fontSize:"42sp" }});
	var tableRows = [];

	var files = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory).getDirectoryListing();
	for (var i = 0; i < files.length; i++) {
		if (SUPPORTED_AUDIO_FORMAT[getExtention(files[i])]) {
			var rowView = Ti.UI.createTableViewRow();
			var label = Ti.UI.createLabel({
                text:files[i],
                width: Ti.UI.FILL,
                height: "50dp",
                align: "left",
                left: "15dp",
                font: {fontSize:"20dp"}
            });
            if (Ti.Platform.osname == 'android') {label.height = "100dp";}
            rowView.add(label);
			tableRows.push(rowView);
		}
	}

	var tableView = Ti.UI.createTableView({data:tableRows});
	//tableView.rowHeight = 300;

	tableView.addEventListener('click', function(e) {
			Ti.API.info("click");
			//Ti.API.info(e.source);
		
		if (currentPlayingAudioData !== null) {
			Ti.API.info("HaltChannel");
			
			ALmixer.HaltChannel(0);
			// Calling FreeData is somewhat optional because garbage collection will eventually clean up for you.
			// However, beause audio resources are often more limited (they open file handles, use hardware resources, eat lots of memory)
			// it FreeData will release all the low-level resources immediately. 
			// So for example, without this call, if you keep changing the song really fast, if you are unlucky and the GC doesn't kick in fast enough,
			// you will get an error when you try to call LoadStream because you exhausted one of several potential resources.
			// Calling FreeData will avoid that particular problem.
			ALmixer.FreeData(currentPlayingAudioData);
			// FreeData frees the underlying audio resources, but not the JavaScript proxy object that refers to it.
			// Remember to release your references in JavaScript to the audio handle.
			currentPlayingAudioData = null;
		}
		if (e.source.children[0]) {
			var filename = e.source.children[0].text.toString();
		}
		else {
			var filename = e.source.text.toString();
		}
		Ti.API.info("Loading file: '" + filename + "' ");
		currentPlayingAudioData = ALmixer.LoadStream(filename);
		if (currentPlayingAudioData !== null) {
			var res = ALmixer.PlayChannel(0, currentPlayingAudioData);
			if (res < 0) {
				alert("ALmixer.PlayChannel failed for " + filename + " [" + res + "]\n" + ALmixer.GetError());
			}
		}
	});

	view.add(headerLabel);
	view.add(tableView);

	self.add(view);

    self.addEventListener('android:back', function(){
		self.close();
    });
    self.addEventListener('close', function(){
		if (currentPlayingAudioData !== null) {
			ALmixer.HaltChannel(0);
			ALmixer.FreeData(currentPlayingAudioData);			
			currentPlayingAudioData = null;
		}
    });
    self.addEventListener('blur', function(){
		ALmixer.BeginInterruption();

    });

	self.addEventListener('focus', function(){
		ALmixer.EndInterruption();
    });

	if (!ALmixer_Initialized && !ALmixer.Init(0, 0, 0)) {
		alert("ALmixer.Init failed!");
	} else {
		ALmixer_Initialized = true;
	}

	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
