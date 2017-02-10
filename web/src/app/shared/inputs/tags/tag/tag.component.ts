import { Component, OnInit, AfterViewInit, 
         ViewChild, ElementRef,
         Input, EventEmitter, Pipe, 
         PipeTransform }                      from '@angular/core';
import { TagPipe }                            from '../tag-pipe/tag.pipe';

// Services
import { ConfigService }                      from '../../../config/config.service';
import { DavisService }                       from '../../../davis.service';
import * as _                                 from "lodash";

@Component({
  selector: 'tag',
  templateUrl: './tag.component.html',
})
export class TagComponent implements OnInit, AfterViewInit {
  
  @Input() tag: any;

  @ViewChild('keyInput') keyInput: ElementRef;
  @ViewChild('valueInput') valueInput: ElementRef;
  
  keys: any = {
    'Browser Type': {
      key: 'Browser Type',
      values: [
        'Desktop Browser',
        'Mobile Browser',
        'Robot',
      ],
    },
    'Browser Family': {
      key: 'Browser Family',
      values: [
        'Chrome',
        'Firefox',
        'Safari',
      ],
    },
    'Browser Version': {
      key: 'Browser Version',
      values: [
        'Chrome 11',
        'Chrome 18',
        'Chrome 22',
      ],
    },
  };
  values: any = [];
  highlighted: any = {
    key: '',
    value: '',
  };
  keyFocused: boolean = false;
  valueFocused: boolean = false;

  constructor(
    public tagPipe: TagPipe,
    public iDavis: DavisService,
    public iConfig: ConfigService) { }
    
  keyInputKeyUp(event: any) {
    (this.keys[this.tag.key]) ? this.values = this.keys[this.tag.key].values : this.tag.value = ''; 
    if (this.tag.key) {
      this.keyInput.nativeElement.style.width = ((this.tag.key.length * 7) - 4) + 'px';
    }
    
    let keysFilteredArray = this.tagPipe.transform(this.keys, this.tag.key);
    let highlightedIndex = _.findIndex(keysFilteredArray, (o: any) => { return o && o.key == this.highlighted.key; });
    
    // Up arrow key pressed
    if (event.keyCode === 38) {
      if (highlightedIndex > 0) {
        this.highlighted.key = keysFilteredArray[highlightedIndex - 1].key;
      } else {
        this.highlighted.key = keysFilteredArray[keysFilteredArray.length - 1].key;
      }
      
    // Down arrow key pressed
    } else if (event.keyCode === 40) {
      if (highlightedIndex < keysFilteredArray.length - 1) {
        this.highlighted.key = keysFilteredArray[highlightedIndex + 1].key;
      } else {
        this.highlighted.key = keysFilteredArray[0].key;
      }
    } else if (event.keyCode === 13) {
      if (highlightedIndex > -1) this.tag.key = keysFilteredArray[highlightedIndex].key;
      if (this.keys[this.tag.key]) this.values = this.keys[this.tag.key].values;
      this.focusValueInput();
    }
  }
  
  valueInputKeyUp(event: any) {
    if (this.tag.value) {
      this.valueInput.nativeElement.style.width = ((this.tag.value.length * 7) - 4) + 'px';
    }
    
    let valuesFilteredArray = this.tagPipe.transform(this.values, this.tag.value);
    let highlightedIndex = _.findIndex(valuesFilteredArray, (o: any) => { return o && o == this.highlighted.value; });
    
    // Up arrow key pressed
    if (event.keyCode === 38) {
      if (highlightedIndex > 0) {
        this.highlighted.value = valuesFilteredArray[highlightedIndex - 1];
      } else {
        this.highlighted.value = valuesFilteredArray[valuesFilteredArray.length - 1];
      }
      
    // Down arrow key pressed
    } else if (event.keyCode === 40) {
      if (highlightedIndex < valuesFilteredArray.length - 1) {
        this.highlighted.value = valuesFilteredArray[highlightedIndex + 1];
      } else {
        this.highlighted.value = valuesFilteredArray[0];
      }
    } else if (event.keyCode === 13) {
      if (highlightedIndex > -1) this.tag.value = valuesFilteredArray[highlightedIndex];
      this.valueInput.nativeElement.blur();
    }
  }
  
  focusKeyInput() {
    this.keyFocused = true;
    setTimeout(() => {
      this.keyInput.nativeElement.style.width = ((this.tag.key.length * 7) - 4) + 'px';
      this.keyInput.nativeElement.focus();
    }, 120);
  }
  
  focusValueInput() {
    this.valueFocused = true;
    setTimeout(() => {
      this.valueInput.nativeElement.style.width = ((this.tag.value.length * 7) - 4) + 'px';
      this.valueInput.nativeElement.focus();
    }, 220);
  }
  
  ngOnInit() {}
  
  ngAfterViewInit() {}
}
