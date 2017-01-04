// ============================================================================
// Davis Base - Component
//
// This component creates Davis landing page
// ============================================================================

// ----------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------
// Angular
import { Component, OnInit }      from '@angular/core';
import { Router }                 from '@angular/router';
import { ConfigService }          from '../../shared/config/config.service';
import { DavisService }           from '../../shared/davis.service';
import * as _                     from "lodash";

// ----------------------------------------------------------------------------
// Class
// ----------------------------------------------------------------------------
@Component({
  selector:    'davis-base',
  templateUrl: './davis-base.component.html',
})

export class DavisBaseComponent implements OnInit {
  
  davisInput: string = '';
  davisOutput: string = '';
  davisMode: any;
  modes: any = {
    listening: {
      title: 'Listening...',
      name: 'listening'
    },
    processing: {
      title: 'Processing...',
      name: 'processing'
    },
    sleeping: {
      title: 'Say "Hey davis" to wake me',
      name: 'sleeping'
    },
    silent: {
      title: 'Launch phrase disabled, click mic to wake me',
      name: 'silent'
    },
    chat: {
      title: 'Chat',
      name: 'chat'
    },
    noMic: {
      title: 'Chat - No mic detected',
      name: 'Say "Hey davis" to wake me'
    }
  };
  placeholder: string = 'Did anything happen last night?';
  isDavisInputFocused: boolean = false;
  isDavisListening: boolean = false;
  
  // ------------------------------------------------------
  // Inject services
  // ------------------------------------------------------
  constructor(public router: Router, public iConfig: ConfigService, public iDavis: DavisService) { }

  // ------------------------------------------------------
  // Initialize component
  // ------------------------------------------------------
  
  doSubmit() {
    this.iDavis.askDavis(this.davisInput)
      .then(result => {this.davisOutput = result.response.visual.text;})
      .catch(err => {console.log(err)});
  }
  
  toggleListening(isListening: boolean) {
    this.isDavisListening = isListening;
    
    if (this.isDavisListening && !this.isDavisInputFocused) {
      this.davisMode = this.modes.listening;
    } else if (this.isDavisInputFocused) {
      this.davisMode = this.modes.chat; 
    } else {
      this.davisMode = this.modes.silent;
    }
  }
  
  ngOnInit() {
    this.iDavis.isBreadcrumbsVisible = true;
    this.davisMode = this.modes.chat;
    
    if (!this.iDavis.values.user.email) {
      this.iDavis.getDavisUser()
        .then(result => {
          if (result.success) {
            this.iDavis.values.user = result.user;
            if (!result.user.name) {
              this.iDavis.values.user.name = {first:'',last:''};
            } else {
              if (!result.user.name.first) this.iDavis.values.user.name.first = '';
              if (!result.user.name.last) this.iDavis.values.user.name.last = '';
            }
            this.iDavis.values.original.user = _.cloneDeep(this.iDavis.values.user);
          } else {
            this.iConfig.generateError('user', result.message);
          }
        })
        .catch(err => {
          if (JSON.stringify(err).includes('invalid token')) {
            this.iDavis.logOut();
          }
        });
    }
  }
}
