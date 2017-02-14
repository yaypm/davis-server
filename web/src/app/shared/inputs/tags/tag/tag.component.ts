import { Component, OnChanges, 
         OnInit, AfterViewInit,
         QueryList, SimpleChange,
         ViewChild, ViewChildren, ElementRef,
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
  @Input() focus: boolean;

  @ViewChild('keyInput') keyInput: ElementRef;
  @ViewChild('valueInput') valueInput: ElementRef;
  @ViewChild('keySpan') keySpan: ElementRef;
  @ViewChild('valueSpan') valueSpan: ElementRef;
  @ViewChildren('keysList') keysList: QueryList<ElementRef>;
  @ViewChildren('valuesList') valuesList: QueryList<ElementRef>;
  
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
    
  keyInputGeneralKeyUp(event: any) {
    if (this.keys[this.tag.key]) { 
      this.values = this.keys[this.tag.key].values;
    } else {
      this.values = [];
      this.tag.value = '';
    }
  }
    
  keyInputSpecialKeyUp(event: any) {
    if (this.keys[this.tag.key]) { 
      this.values = this.keys[this.tag.key].values;
    } else {
      this.tag.value = '';
    }
    
    let keysFilteredArray = this.tagPipe.transform(this.keys, this.tag.key);
    let highlightedIndex = _.findIndex(keysFilteredArray, (o: any) => { return o && o.key == this.highlighted.key; });
    
    // Up arrow key pressed
    if (event.keyCode === 38) {
      if (highlightedIndex > 0) {
        this.highlighted.key = keysFilteredArray[highlightedIndex - 1].key;
        this.keysList.toArray()[highlightedIndex - 1].nativeElement.scrollIntoView(false);
      } else {
        this.highlighted.key = keysFilteredArray[keysFilteredArray.length - 1].key;
        this.keysList.toArray()[keysFilteredArray.length - 1].nativeElement.scrollIntoView(false);
      }
      
    // Down arrow key pressed
    } else if (event.keyCode === 40) {
      if (highlightedIndex < keysFilteredArray.length - 1) {
        this.highlighted.key = keysFilteredArray[highlightedIndex + 1].key;
        this.keysList.toArray()[highlightedIndex + 1].nativeElement.scrollIntoView(false);
      } else {
        this.highlighted.key = keysFilteredArray[0].key;
        this.keysList.toArray()[0].nativeElement.scrollIntoView(false);
      }
    } else if (event.keyCode === 13) {
      if (highlightedIndex > -1 && keysFilteredArray[highlightedIndex]) this.tag.key = keysFilteredArray[highlightedIndex].key;
      if (keysFilteredArray && keysFilteredArray.length === 1) this.tag.key = keysFilteredArray[0].key;
      if (this.keys[this.tag.key]) this.values = this.keys[this.tag.key].values;
      this.focusValueInput(null);
    }
  }
  
  valueInputSpecialKeyUp(event: any) {
    
    let valuesFilteredArray = this.tagPipe.transform(this.values, this.tag.value);
    let highlightedIndex = _.findIndex(valuesFilteredArray, (o: any) => { return o && o == this.highlighted.value; });
    
    // Up arrow key pressed
    if (event.keyCode === 38) {
      if (highlightedIndex > 0) {
        this.highlighted.value = valuesFilteredArray[highlightedIndex - 1];
        this.valuesList.toArray()[highlightedIndex - 1].nativeElement.scrollIntoView(false);
      } else {
        this.highlighted.value = valuesFilteredArray[valuesFilteredArray.length - 1];
        this.valuesList.toArray()[valuesFilteredArray.length - 1].nativeElement.scrollIntoView(false);
      }
      
    // Down arrow key pressed
    } else if (event.keyCode === 40) {
      if (highlightedIndex < valuesFilteredArray.length - 1) {
        this.highlighted.value = valuesFilteredArray[highlightedIndex + 1];
        this.valuesList.toArray()[highlightedIndex + 1].nativeElement.scrollIntoView(false);
      } else {
        this.highlighted.value = valuesFilteredArray[0];
        this.valuesList.toArray()[0].nativeElement.scrollIntoView(false);
      }
    } else if (event.keyCode === 13) {
      if (highlightedIndex > -1 && valuesFilteredArray[highlightedIndex]) this.tag.value = valuesFilteredArray[highlightedIndex];
      if (valuesFilteredArray && valuesFilteredArray.length === 1) this.tag.value = valuesFilteredArray[0];
      this.valueInput.nativeElement.blur();
    }
  }
  
  focusKeyInput() {
    this.keyFocused = true;
    // Stack Overflow workaround for ngIf timing issue 
    // http://stackoverflow.com/questions/37355768/how-to-check-whether-ngif-has-taken-effect
    setTimeout(() => {
      this.keyInput.nativeElement.focus();
    }, 0);
  }
  
  focusValueInput(key: any) {
    if (key && key.value) {
      this.values = key.value.values; 
      this.tag.key = key.value.key;
    } else if (key) {
      this.values = key.values;
      this.tag.key = key.key;
    }
    this.valueFocused = true;
    setTimeout(() => {
      this.valueInput.nativeElement.focus();
    }, 0);
  }
  
  clearKey() {
    this.values = []; 
    this.tag.value = ''; 
    this.tag.key = '';
  }
  
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes['focus'] && this.tag.focus) {
      this.focusKeyInput();
      this.tag.focus = false;
    }
  }
  
  ngOnInit() {}
  
  ngAfterViewInit() {}
}
