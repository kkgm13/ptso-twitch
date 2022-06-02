// my-component.js
export default {
    mounted(){
        console.log("Form Mounted Correctly");
    },
    template:'<form action="../admin" method="post"><div class="mb-1"><h4 class="text-center">Add New Streamer Info</h4><hr></div><fieldset><div class="form-floating mb-3"><input type="text" name="streamerInput" class="form-control" id="streamerInput" placeholder="Streamer Name" required><label for="streamerInput">Streamer Name</label></div><div class="form-floating"><textarea wrap="soft" name="streamerDetail" class="form-control" placeholder="Leave a comment here" id="streamerDetails" required></textarea><label for="streamerDetail">Details about Streamer</label></div><div id="streamerDetailHelp" class="form-text">Please use semicolons (;) to separate dedicated information.</div></fieldset><hr><div class="row form-group"><div class="col-6 py-1"><div class="d-grid gap-2"><input type="submit" value="Create Entry" class="btn btn-success"></div></div><div class="col-6 py-1"><div class="d-grid gap-2"><input type="reset" value="Reset" class="btn btn-danger"></div></div></div></form>',
    data() {
        return {
        }
    },
}

