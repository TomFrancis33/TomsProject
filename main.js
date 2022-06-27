class Api {
    constructor() {
        this.url = "https://api.nhs.uk/medicines?api-version=";
        this.key = "bcd42838726a4d949911e258fc5ab777";
        this.JsonResponse = false;
        this.medicineUrlArray = [];
    }
    init() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", this.url, false); //opening the request connection
        /*false means asynchronous, when it makes a requests it waits
        for a response in the background*/ 
        xmlHttp.setRequestHeader("subscription-key", this.key);
        xmlHttp.send(null);
        this.JsonResponse = JSON.parse(xmlHttp.responseText);
        //adding all the names of the medicines into the 'medicineUrlArray'
        for (let index = 0; index < this.JsonResponse.significantLink.length; index++) {
            this.medicineUrlArray[this.JsonResponse.significantLink[index].name] = 
            this.JsonResponse.significantLink[index].url;
        }
    }
    findDetails(medicineName) { /*create a new HTTP connection to the new url in order to
        retrieve data from the medicines specific page*/
        var medicineUrl = this.medicineUrlArray[medicineName];
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", medicineUrl, false);
        xmlHttp.setRequestHeader("subscription-key", this.key);
        xmlHttp.send(null);
        // parse the result into JSON so it is easier to read
        var medicineResponse = JSON.parse(xmlHttp.responseText);
        console.log(medicineResponse);
        //outputing information about the specific medicine
        return medicineResponse.hasPart[0].hasPart[0].text; 
    }
}

$(document).ready(function(){
    //creates a new object
    const medicines = new Api();
    medicines.init();
    //printing the API data to the console
    console.log(medicines);
    ApiRequest = medicines.JsonResponse;
    //creates a dropbox containing all medicine names
    for (let index = 0; index < ApiRequest.significantLink.length; index++) {
        $("#showMedicines").append("<option value='"+ ApiRequest.significantLink[index].name +
        "'>" + ApiRequest.significantLink[index].name + "</option>");
    }

    $("#showMedicines").change(function(){
        $('.medicineName').html(this.value);
        //displaying a message to the user that no result has come up for such item
        $('.show').html("<br>" + "A description does not exist for this medicine");
        var medicineDetails = medicines.findDetails(this.value);
        //displays the information from the API to the screen
        $('.show').html(medicineDetails);
    })
});