<template>
    <div class="row">
        <div class="col-5">
            <div class="d-grid gap-2">
                <button type="button" class="btn btn-info" @click="loadData"><i class="bi bi-arrow-clockwise"></i> Force Update</button>
            </div>
        </div>
        <div class="col-7">
            <div class="input-group">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="search"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control" v-model="filteredSearch" placeholder="Search by Name">
                    </div>
            </div>
        </div>
    </div>
    <div class="fixed-head">
        <table class="table table-responsive table-striped table-hover px-2">
            <thead class="table-dark">
                <tr>
                    <th scope="col">Streamer</th>
                    <th scope="col">Personalized Streamer Details</th>
                    <th scope="col">Options</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isDataEmpty">
                    <th scope="row">ptsoTwitch</th>
                    <td>Personal Shoutout for Twitch; Overlay System;This is a sample to see how this works;</td>
                    <td><div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-warning" disabled><i class="bi bi-pencil-fill"></i></button>
                        <button type="button" class="btn btn-danger" disabled><i class="bi bi-trash-fill"></i></button>
                    </div></td>
                </tr>
                <tr v-else v-for="item in filteredStreamer">
                    <th scope="row">{{item.streamerName}}</th>
                    <td>{{item.streamerDetails}}</td>
                    <td><div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-warning" @click="editStreamer(item)"><i class="bi bi-pencil-fill"></i></button>
                        <button type="button" class="btn btn-danger" @click="deleteStreamer(item)"><i class="bi bi-trash-fill"></i></button>
                    </div></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
export default {
    mounted() {
        this.loadData();
        console.log("Streamer List Data mounted successfully");
    },
    computed: {
        filteredStreamer() {
            return this.items.filter(item =>
                item.streamerName.toLowerCase().includes(this.filteredSearch.toLowerCase())
            );
        },
        isDataEmpty() {
            return this.items.length === 0;
        }
        },
        methods: {
            editStreamer(item) {
                alert("This is still in Beta due to the complexity of internal data passing.\nBut ensure to copy/paste required info to edit to ensure it's captured.");
                console.log(item);
            },
            async deleteStreamer(item) {
                if (confirm("Do you wish to delete details about " + item['streamerName'] + "?") === true) {
                    await axios.get('assets/php/db-delete.php', {
                        params: {
                            twitchID: item.twitchID,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(function (response) {
                        console.log(response.data.message);
                    });
                    this.loadData();
                }
            },
            loadData() {
                this.filteredSearch = "";
                // Uncomment the following lines if you want to use the linkToPHP function
                // linkToPHP()
                //   .then(data => {
                //     this.items = data;
                //   });
            },
        },
        data() {
        return {
            filteredSearch: '',
            items: []
        };
        },
    };
</script>

<style scoped>
/* Your styles here */
</style>