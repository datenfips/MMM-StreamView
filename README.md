# MMM-StreamView

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).
It was HEAVILY inspired by [brobergp/MMM-htmlvideo](https://github.com/brobergp/MMM-htmlvideo) but suited to fit my needs. It is re-written based on [roramirez/MagicMirror-Module-Template](https://github.com/roramirez/MagicMirror-Module-Template).

The inital idea was to show the traffic cams around my area to be mentally prepared when the morning ride starts and if I have to expect high traffic or plan working from the home office.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-StreamView',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `option1`        | *Required* DESCRIPTION HERE
| `option2`        | *Optional* DESCRIPTION HERE TOO <br><br>**Type:** `int`(milliseconds) <br>Default 60000 milliseconds (1 minute)
