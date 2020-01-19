import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { ElementRef, ViewChild } from "@angular/core";
import { interval } from "rxjs";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css']
})
export class SampleComponent implements OnInit, OnDestroy {

  @ViewChild("fileUpload") fileUploadEl: ElementRef;
  form: FormGroup;
  private _singleSignOnChecked: boolean;
  private _systemData: any = [];
  private _selected: any = [];
  private _selectedList: any = [];
  private _disableAllTextbox: boolean;
  private _tableCheckboxMap: Object = {};
  public get tableCheckboxMap(): Object {
    return this._tableCheckboxMap;
  }
  public set tableCheckboxMap(value: Object) {
    this._tableCheckboxMap = value;
  }
  public get disableAllTextbox(): boolean {
    return this._disableAllTextbox;
  }
  public set disableAllTextbox(value: boolean) {
    this._disableAllTextbox = value;
  }
  public get selectedList(): any {
    return this._selectedList;
  }
  public set selectedList(value: any) {
    this._selectedList = value;
  }
  subscription: Subscription;
  intervalId: number;
  private _disableImportButton: boolean;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      eusername: [{ value: "", disabled: true }],
      epassword: [{ value: "", disabled: true }],
      esingleSignOnChecked: [{ value: false, disabled: true }]
    });
  }

  onChanges() {
    if (Object.keys(this.selected).length > 1) {
      this.form.controls["esingleSignOnChecked"].enable();
    } else {
      this.form.controls["esingleSignOnChecked"].disable();
    }
    this.form.controls["esingleSignOnChecked"].valueChanges.subscribe(
      selectedCheckbox => {
        this.singleSignOnChecked = selectedCheckbox;
        if (selectedCheckbox !== true) {
          this.form.controls["eusername"].reset();
          this.form.controls["eusername"].disable();
          this.form.controls["epassword"].reset();
          this.form.controls["epassword"].disable();
          this.disableImportButton = true;
          if (Object.keys(this.selected).length > 0) {
            this.disableImportButton = false;
          }
        } else {
          this.form.controls["eusername"].enable();
          this.form.controls["epassword"].enable();
          this._disableAllTextbox = true;
          if (
            this.form.controls["eusername"].value !== "" &&
            this.form.controls["epassword"].value !== ""
          ) {
            this.disableImportButton = false;
          } else {
            this.disableImportButton = true;
          }
        }
      }
    );
  }

  ngOnInit() {
    const source = interval(1500);
    this.subscription = source.subscribe(val => this.onChanges());
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  public fileChanged(event?: UIEvent): void {
    const files: FileList = this.fileUploadEl.nativeElement.files;
    const file = files[0];
    const reader = new FileReader();
    const ff = {};
    const loaded = el => {
      const contents = el.target.result;
      for (const dd of JSON.parse(contents.toString())["systems"]) {
        dd["username"] = "";
        dd["password"] = "";
        dd["selected"] = false;
        this.systemData.push(dd);
      }
    };
    reader.onload = loaded;
    reader.readAsText(file, "UTF-8");
    this.disableAllTextbox = true;
  }

  submit() {
    const qqq = [];
    for (const hh of this.systemData) {
      if (this.selected.includes(hh)) {
        hh["selected"] = true;
      } else {
        hh["selected"] = false;
      }
      this.selectedList.push(hh);
    }
    this.selectedList.forEach(function(value, i) {
      const username = <HTMLInputElement>(
        document.getElementsByName("username-" + i)[0]
      );
      const password = <HTMLInputElement>(
        document.getElementsByName("password-" + i)[0]
      );
      if (value["selected"] === true) {
        if (qqq !== undefined) {
          if (username.value !== null || username.value !== undefined) {
            value["username"] = username.value;
          }
          if (password.value !== null || password.value !== undefined) {
            value["password"] = password.value;
          }
          qqq.push(value);
        }
      }
    });
  }

  selectedChanged(event, ele) {
    const nodes = document
      .getElementById(ele["id"])
      .getElementsByTagName("input");
    this.tableCheckboxMap[ele["id"]] = event;
    if (this.singleSignOnChecked) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].getAttribute("class") !== null) {
          const splittedClass = nodes[i].getAttribute("class").split(" ");
          for (const className of splittedClass) {
            if (className === "table-input-textbox") {
              nodes[i].setAttribute("disabled", "true");
            }
          }
        }
      }
    } else {
      if (!ele["allSelected"]) {
        if (!event) {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].getAttribute("class") !== null) {
              const splittedClass = nodes[i].getAttribute("class").split(" ");
              for (const className of splittedClass) {
                if (className === "table-input-textbox") {
                  nodes[i].setAttribute("disabled", "true");
                }
              }
            }
          }
        } else {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].getAttribute("class") !== null) {
              const splittedClass = nodes[i].getAttribute("class").split(" ");
              for (const className of splittedClass) {
                if (className === "table-input-textbox") {
                  nodes[i].removeAttribute("disabled");
                }
              }
            }
          }
        }
      }
    }
  }

  selectedAllChanged(event, ele) {
    if(ele['allSelected'] === true) {
console.log("True", ele);
     for(const rows of ele['rows']['_results']) {
       console.log(rows)
     }
    } else if(ele['allSelected'] === false){
console.log("False");
    }
  }

  handleSelected(event) {
    if (event["target"]["checked"] === true) {
      this.disableAllTextbox = true;
      JSON.parse(JSON.stringify(this.tableCheckboxMap), (key, value) => {
        if (document.getElementById(key) !== null) {
          const nodes = document
            .getElementById(key)
            .getElementsByTagName("input");
          this.tableCheckboxMap[key] = true;
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].getAttribute("class") !== null) {
              const splittedClass = nodes[i].getAttribute("class").split(" ");
              for (const className of splittedClass) {
                if (className === "table-input-textbox") {
                  nodes[i].setAttribute("disabled", "true");
                }
              }
            }
          }
        }
      });
    } else {
      console.log("JSON", JSON.parse(JSON.stringify(this.tableCheckboxMap)));
      JSON.parse(JSON.stringify(this.tableCheckboxMap), (key, value) => {
        if (document.getElementById(key) !== null) {
          const nodes = document
            .getElementById(key)
            .getElementsByTagName("input");
          if (value === true) {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].getAttribute("class") !== null) {
                const splittedClass = nodes[i].getAttribute("class").split(" ");
                for (const className of splittedClass) {
                  if (className === "table-input-textbox") {
                    nodes[i].removeAttribute("disabled");
                  }
                }
              }
            }
          } else {
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].getAttribute("class") !== null) {
                const splittedClass = nodes[i].getAttribute("class").split(" ");
                for (const className of splittedClass) {
                  if (className === "table-input-textbox") {
                    nodes[i].setAttribute("disabled", "true");
                  }
                }
              }
            }
          }
        }
      });
    }
  }

  public get selected(): any {
    return this._selected;
  }
  public set selected(value: any) {
    this._selected = value;
  }
  public get systemData(): any {
    return this._systemData;
  }
  public set systemData(value: any) {
    this._systemData = value;
  }
  public get singleSignOnChecked(): boolean {
    return this._singleSignOnChecked;
  }
  public set singleSignOnChecked(value: boolean) {
    this._singleSignOnChecked = value;
  }
  public get disableImportButton(): boolean {
    return this._disableImportButton;
  }
  public set disableImportButton(value: boolean) {
    this._disableImportButton = value;
  }
}