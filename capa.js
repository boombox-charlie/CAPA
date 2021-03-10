function ready(fn) {
  if (document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

const data = {
   capa :{
   "id":"",
   "request_to":"a",
   "request_date":"b",
   "request_ref":"d",
   "request_nonconf":"c",
   "request_risk":"e",
   "report_act_required":"g",
   "report_assigned_to":"h",
   "report_target_date":"i",
   "report_action_taken":"j",
   "report_completed_date":"k",
   "audit_assigned":"l",
   "audit_date":"m",
   "audit_results":"n",
   "audit_effectiveness":"o"
   }
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

Vue.filter('asDate', function(value) {
  if (typeof(value) === 'number') {
    value = new Date(value * 1000);
  }
  const date = moment.utc(value)
  return date.isValid() ? date.format('MMMM DD, YYYY') : value;
});


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

