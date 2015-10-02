# jquery-hubspot-scrub
Simple plugin to retrieve pre-filled form data from Hubspot.
Why store things in your own cookies, when the data is already in Hubspot?

Hubspot has magic that auto-detects the user based on a combination of cookies and IP data and can load up pre-filled form values that the user has entered before on one of your sites. You might want access these values for use in Javascript, and that's the goal here. It must be running on your Hubspot-enabled domain.

Params:
```$.hubspotScrub(callback, portalID, FormID);```

Examples:
```
jQuery(document).ready(function () {

    // Retreive the values for a specific hubspot form without embedding it on the page
    jQuery().hubspotScrub(function (vals) {
        console.log('Retreive the values for a specific hubspot form without embedding it on the page:');
        console.log(vals);
    }, 458015, '62f55268-83d5-4d1d-9532-563b18ca2b8a');

    // Retreive the values for multiple hubspot form without embedding
    jQuery().hubspotScrub(function (vals) {
        console.log('Retreive the values for multiple hubspot form without embedding:');
        console.log(vals);
    }, 458015, ['62f55268-83d5-4d1d-9532-563b18ca2b8a', '3cc0d96a-4a70-47ce-af9b-ca2d769e9847']);

    // Get the values for hubspot forms already in the DOM (if any)
    jQuery(document).hubspotScrub(function (vals) {
        console.log('Get the values for hubspot forms already in the DOM (if any):');
        console.log(vals);
    });
    
});
```
