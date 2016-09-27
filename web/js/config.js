//var aliases = {};

// Temp hardcoded
var aliases = {
    applications: [
        {
            name: 'Madison Island',
            display: {
                audible: 'Madison Island',
                visual: 'Madison Island'
            },
            aliases: ['Madison']
        },{
            name: 'www.easytravel.com',
            display: {
                audible: 'easy travel',
                visual: 'www.easytravel.com'
            },
            aliases: ['easy travel', 'easytravel.com']
        },{
            name: 'www.easytravelb2b.com',
            display: {
                audible: 'easy travel business to business',
                visual: 'easyTravel business to business'
            },
            aliases: ['easy travel', 'easytravel.com']
        },{
            name: 'www.weather.easytravel.com',
            display: {
                audible: 'weather easy travel',
                visual: 'easyTravel weather'
            },
            aliases: ['weather', 'whether', 'weather easy travel', 'whether easy travel', 'easy travel weather', 'easy travel whether']
        },{
            name: 'www.vmware.easytravel.com',
            display: {
                audible: 'VM ware Easy Travel',
                visual: 'VMware easyTravel'
            },
            aliases: ['vmware', 'vmware easy travel', 'v m ware easy travel']
        },{
            name: 'image gallery',
            display: {
                audible: 'image gallery',
                visual: 'image gallery'
            },
            aliases: []
        },{
            name: 'easyTravel Demo',
            display: {
                audible: 'easy travel demo',
                visual: 'easyTravel demo'
            },
            aliases: ['easy travel demo']
        }
    ],
    
    infrastructure: [
        {
            name: 'eT-demo-2-CustomerFrontend',
            display: {
                audible: 'Easy Travel customer frontend',
                visual: 'easyTravel customer frontend'
            },
            aliases: []
        }, {
            name: 'BB1-apache-tomcatjms-iis-node',
            display: {
                audible: 'Easy Travel Business Backend One',
                visual: 'easyTravel Business Backend server #1'
            },
            aliases: []
        }, {
            name: 'BB2-apache-tomcatjms-iis-node',
            display: {
                audible: 'Easy Travel Business Backend Two',
                visual: 'easyTravel Business Backend server #2'
            },
            aliases: []
        }, {
            name: 'couchDB_ET',
            display: {
                audible: 'couch DB',
                visual: 'CouchDB'
            },
            aliases: []
        }, {
            name: '192.168.118.68',
            display: {
                audible: 'VM ware Hypervisor',
                visual: 'PowerEdge R420 VMware ESXi'
            },
            aliases: []
        }
    ],
    
    services: [
        {
            name: 'AuthenticationService',
            display: {
                audible: 'authentication',
                visual: 'authentication'
            },
            aliases: []
        }, {
            name: 'EasyTravelWebserver:18079',
            display: {
                audible: 'Easy Travel Web Server',
                visual: 'easyTravel Web Server'
            },
            aliases: []
        }, {
            name: 'easyTravelVmware-Business',
            display: {
                audible: 'Easy Travel business backend',
                visual: 'easyTravel business backend'
            },
            aliases: []
        }
    ]
};

function changePage(id) {
    $('.sidebar-button-active').removeClass('sidebar-button-active');
    $('.page-active').removeClass('page-active');
    $('#' + id).addClass('sidebar-button-active');
    $(`#${id}-page`).addClass('page-active');
}

function changeSection(id) {
    $('.radio-button-selected').removeClass('radio-button-selected');
    $('.radio-button-section-selected').removeClass('radio-button-section-selected');
    $('#' + id).addClass('radio-button-selected');
    $(`#${id}-section`).addClass('radio-button-section-selected');
}

function addAlias(alias, category) {
    aliases[category].push(alias);
}

function editAlias(alias, category) {
    var success = false;
    
    aliases[category].forEach( function (als, index) {
        if (als.name === alias.name) {
            aliases[category][index] = alias;
            success = true;
        } 
    });
    
    return success;
}

function getAliases() {
    for (category in aliases) {
        aliases[category].forEach( function (als) {
            var template = `<table class="alias"><tr><td class="property" style="font-weight: bold;">Name</td><td class="value"><input type="text" class="textInput" value="${als.name}"></td></tr>
            <tr><td class="property">Visual</td><td class="value"><input type="text" class="textInput" value="${als.display.visual}"></td></tr>
            <tr><td class="property">Audible</td><td class="value"><input type="text" class="textInput" value="${als.display.audible}"></td></tr>
            <tr><td class="property">Aliases</td></tr><tr><td class="aliases" colspan="2">`;
            als.aliases.forEach( function (alias, index) {
                template += `<div class="wrapper"><input type="text" class="textInput" value="${alias}">`;
                if (index < als.aliases.length - 1) {
                    template += '<div class="comma">,</div>';
                }
                template += '</div>';
            });
            $(`#${category}-aliases-section`).append(`${template}</td></tr></table>`);
        });
    }
}

function saveAliases() {
    
    var options = {
        method: 'get',
        mode: 'cors',
        body: JSON.stringify(aliases)
    };
    
    fetch('/config', options)
        .then(function (response) {
            
            return response.json();
            
        }).then(function (data) {

        })
        .catch(function (err) {
            console.log('config.js - Error: ' + err);
        });
}