var Eye = RegisterApp('Eye');
var InEye = false;
var HexgonStyleObject = {
    textShadow: "#00ffe1 0px 0 20px",
    webkitTextStroke: "1.5px #7fc8bb"
};

// Function to apply hexagon styles
function applyHexagonStyles() {
    $('#hex').css({
        'text-shadow': HexgonStyleObject.textShadow,
        '-webkit-text-stroke': HexgonStyleObject.webkitTextStroke
    });
}

function updateHexagonStyles() {
    $('#hex::before').css({
        'text-shadow': HexgonStyleObject.textShadow,
        '-webkit-text-stroke': HexgonStyleObject.webkitTextStroke
    });
}

Eye.addNuiListener('ToggleEye', (Data) => {
    $('.eye').removeClass('fas fa-eye').addClass('fas fa-eye');
    $('.eye-options').empty();
    
    InEye = Data.State;
    if (InEye) {
        $('.eye-wrapper').show().css('pointer-events', 'auto');
        applyHexagonStyles(); // Apply styles when eye is active
    } else {
        $('.eye-wrapper').hide().css('pointer-events', 'none');
        $('.eye-options').removeClass('show-options');
        // Reset hexagon styles when eye is inactive
        $('#hex').css({
            'text-shadow': 'none',
            '-webkit-text-stroke': 'none'
        });

        // Remove the active-text-shadow class when the eye is closed
        $('#hex').removeClass('active-text-shadow');

        // Revert eye color to default gray when the eye is closed
        $('.eye').css('color', 'gray');
    }
});

// Rest of your code...


Eye.addNuiListener('SetOptions', (Data) => {
    const $eye = $('.eye');
    const $eyeOptions = $('.eye-options');
    const $hex = $('#hex');

    $eyeOptions.empty();

    if (Data.Options.length >= 1) {
        // Update Eye icon class if needed
        $eye.removeClass('fas fa-eye').addClass('fas fa-eye');

        // Update eye color to #1ccccc
        $eye.css('color', '#1ccccc');

        // Generating options HTML with background styles
        let Options = '';
        for (let i = 0; i < Data.Options.length; i++) {
            const Elem = Data.Options[i];
            // Add background styles within the generated HTML
            Options += `<div data-parent="${Elem.Parent}" data-name="${Elem.Name}" class="option archivo" style="color: ${this.StandardColor}; background-color: rgba(180, 0, 255, 0.3); border-radius: 8px; padding: 5px 5px; margin-bottom: 5px; box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);">
                            <i class="${Elem.Icon || 'fas fa-eye'}"></i> ${Elem.Label}
                        </div>`;
        }

        // Update Hexagon styles after changing Eye icon class
        HexgonStyleObject.textShadow = "#1ccccc 0px 0 20px"; // Update text shadow
        HexgonStyleObject.webkitTextStroke = "1.5px #1ccccc"; // Update text stroke
        updateHexagonStyles();

        // Add a class to #hex to enable the text-shadow
        $hex.addClass('active-text-shadow');

        // Add options HTML with fade-in class and trigger the transition
        $eyeOptions.html(Options).hide().fadeIn(250);
    } else {
        // If there are no options, revert Eye icon class and hexagon styles
        $eye.removeClass('fas fa-eye').addClass('fas fa-eye');
        HexgonStyleObject.textShadow = "none"; // Set text shadow to none
        HexgonStyleObject.webkitTextStroke = "none"; // Set text stroke to none
        updateHexagonStyles();

        // Revert eye color to default
        $eye.css('color', 'gray');

        // Remove the class to #hex to disable the text-shadow
        $hex.removeClass('active-text-shadow');
    }
});

$(document).on('click', '.eye-options .option', function(e){
    e.preventDefault();
    if (InEye) {
        $.post("https://mercy-ui/Eye/Click", JSON.stringify({
            Parent: $(this).attr("data-parent"),
            Name: $(this).attr("data-name"),
        }));
    }
});

$(document).keyup(function(e){
    if (!InEye) return;

    switch (e.keyCode) {
        case 27:
            $.post("https://mercy-ui/Eye/Close");
            break;
    }
});

window.addEventListener("mousedown", function onEvent(event) {
    if (!InEye) return;

    if (event.button == 2) {
        $.post("https://mercy-ui/Eye/Unfocus");
    }
});
