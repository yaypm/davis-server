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
            aliases: []
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
                audible: 'www.easytravelb2b.com',
                visual: 'www.easytravelb2b.com'
            },
            aliases: []
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

function addNewAliasTextInput(name, category) {
   // $(`#${name}-table`)
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

function getAliases(name) {
    var filteredAliases = {
        applications: [],
        services: [],
        infrastructure: []
    };
    
    var noAliases = {
        applications: [],
        services: [],
        infrastructure: []
    };
    
    // Filter
    for (category in aliases) {
        aliases[category].forEach( function (als) {
            
            // Filter by name if not null
            if (!name || name.trim() === '' || als.name.indexOf(name.trim()) > -1) {
            
                // No aliases defined 
                if (als.name === als.display.visual && als.display.visual === als.display.audible && als.aliases.length === 0) {
                    noAliases[category].push(als);   
                } else {
                    filteredAliases[category].push(als);
                }
            
            }
        });
    }
    
    // Add names without aliases (noAliases) to the beginning of filteredAliases
    for (category in noAliases) {
        noAliases[category].forEach( function (als) {
           filteredAliases[category].unshift(als);
        });
    }
    
    
    // Build and display tiles
    for (category in filteredAliases) {
        
        // Update count for category
        $(`#${category}-count`).html(`(${filteredAliases[category].length})`);
        
        // Remove current tiles
        $(`#${category}-aliases-section`).html('');
        
        filteredAliases[category].forEach( function (als) {
            var noAliasesClass = '';
            var alsId = als.name.replace(/ /g,'_');
            
            // Identify names with no aliases
            if (als.name === als.display.visual && als.display.visual === als.display.audible && als.aliases.length === 0) {
                noAliasesClass = 'no-aliases ';
            }
            
            var template = `<table id="${alsId}-table" class="alias"><tr><td class="property" style="font-weight: bold;">Name</td>
            <td class="value"><input type="text" id="${alsId}-name" class="textInput" value="${alsId}"><div class="${noAliasesClass}no-aliases-wrapper">
                <div class="no-aliases-text">No<br>Aliases</div><div class="no-aliases-triangle">
            </div></div></td></tr>
            <tr><td class="property">Visual</td><td class="value"><input type="text" id="${alsId}-visual" class="textInput" value="${als.display.visual}"></td></tr>
            <tr><td class="property">Audible</td><td class="value"><input type="text" id="${alsId}-audible" class="textInput" value="${als.display.audible}"></td></tr>
            <tr><td class="property">Aliases</td></tr><tr><td class="aliases" colspan="2">`;
            als.aliases.forEach( function (alias, index) {
                template += `<div class="wrapper"><input type="text" class="textInput ${alsId}-alias" value="${alias}">`;
                template += '<div class="comma">,</div>';
                template += '</div>';
            });
            template += `<div class="${category}-new-aliases-section"><div class="wrapper"><input type="text" class="textInput addNew" value="" placeholder="Add new alias"></div></div>
            </td></tr><tr><td colspan="2"><input type="button" id="${alsId}-save-button" value="Save" onclick="saveAliasesTile('${alsId}');">`;
            $(`#${category}-aliases-section`).append(`${template}</td></tr></table>`);
        });
    }
}

function getAliasData() {
    
    var options = {
        method: 'get',
        mode: 'cors'
    };
    
    fetch('/api/v1/system', options)
        .then(function (response) {
            
            return response.json();
            
        }).then(function (data) {
            // aliases = data;
            getAliases($('#filter').val());
        })
        .catch(function (err) {
            console.log('config.js - Error: ' + err);
        });
}

function saveAliasesTile(alsId) {
    var aliasValues = $(`.${alsId}-alias`).val();
    var aliases = {
        name: $(`#${alsId}-name`).val(),
        display: {
            audible: $(`#${alsId}-audible`).val(),
            visual: $(`#${alsId}-visual`).val()
        },
        aliases: aliasValues
    }
    
    var options = {
        method: 'put',
        mode: 'cors',
        body: JSON.stringify()
    };
    
    fetch('/api/v1/system', options)
        .then(function (response) {
            
            return response.json();
            
        }).then(function (data) {
            // aliases = data;
            // getAliases($('#filter').val());
        })
        .catch(function (err) {
            console.log('config.js - Error: ' + err);
        });
}