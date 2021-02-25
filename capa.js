function ready(fn) {
  if (document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

const data = {
<<<<<<< HEAD
  count: 0,
  capa: {
  
=======
>>>>>>> main
   "id":1,
   "References":{
      "Audit":{
         "Audit":{
<<<<<<< HEAD
            "tableId":"Reports",
            "rowId":1
         },
         "actions":"recombobulated",
         "completed":"1000-01-01T00:00:00.000Z",
         "id":1,
         "request":{
            "tableId":"Requests",
            "rowId":1
         }
      },
      "actions":"recombobulated",
      "completed":"1000-01-01T00:00:00.000Z",
      "id":1,
      "request":{
         "Issued_to":{
            "tableId":"People",
            "rowId":2
         },
         "attachment":[
            
         ],
         "date":null,
         "id":1,
         "nonconformance_noted":"combobulator broken"
=======
            "Audit":{
               "tableId":"",
               "rowId":1
            },
            "actions":"",
            "completed":"",
            "id":1,
            "request":{
               "tableId":"",
               "rowId":1
            }
         },
         "actions":"",
         "completed":"",
         "id":1,
         "request":{
            "Issued_to":{
               "tableId":"People",
               "rowId":2
            },
            "attachment":[
               
            ],
            "date":null,
            "id":1,
            "nonconformance_noted":" "
         }
      },
      "actions":" ",
      "completed":" ",
      "id":1,
      "request":{
         "Issued_to":{
            "A":"Charlie",
            "B":null,
            "C":null,
            "id":2
         },
         "attachment":null,
         "date":null,
         "id":1,
         "nonconformance_noted":" "
>>>>>>> main
      }
   },
   "Audit":{
      "tableId":"Reports",
      "rowId":1
   },
<<<<<<< HEAD
   "actions":"recombobulated",
   "request":"combobulator broken",
   "completed":"1000-01-01T00:00:00.000Z"

  },
  status: "waiting",
  tableConnected: false,
  rowConnected: false,
  haveRows: false
=======
   "actions":" ",
   "request":" ",
   "completed":" "
>>>>>>> main
}
let app = undefined;

function handleError(err) {
  console.error(err);
  const target = app || data;
//  target.capa = "";
  target.status = String(err).replace(/^Error: /, "");
  console.log(data);
}

function updateInvoice(row) {
  try {
    data.status = "";
    if (row === null) {
      throw new Error("(No data - not on row - please add or select a row)");
    }
    console.log("GOT...", JSON.stringify(row));
    if (row.References) {
      try {
        Object.assign(row, row.References);
      } catch (err) {
        throw new Error("Could not understand References column. " + err);
      }
    }

    data.capa = Object.assign({}, data.capa, row);

    // Make invoice information available for debugging.
    window.capa = row;
  } catch (err) {
    handleError(err);
  }
}

ready(function() {
  // Update the invoice anytime the document data changes.
  grist.ready();
  grist.onRecord(updateInvoice);

  // Monitor status so we can give user advice.
  grist.on("message", msg => {
    // If we are told about a table but not which row to access, check the
    // number of rows.  Currently if the table is empty, and "select by" is
    // not set, onRecord() will never be called.
    if (msg.tableId && !app.rowConnected) {
      grist.docApi.fetchSelectedTable().then(table => {
        if (table.id && table.id.length >= 1) {
          app.haveRows = true;
        }
      }).catch(e => console.log(e));
    }
    if (msg.tableId) { app.tableConnected = true; }
    if (msg.tableId && !msg.dataChange) { app.RowConnected = true; }
  });

  Vue.config.errorHandler = function (err, vm, info)  {
    handleError(err);
  };

  app = new Vue({
    el: "#app",
    data: data
  });
});

