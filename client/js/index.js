var transTable = new Vue({
    el: '#transactions-records',
    data: {
      transactions: []
    },
    methods: {
        getData: function(url) {
            return fetch(url)
                .then(response => response.json())
                .then(data => this.transactions = data)
                .catch(err => alert(err.message));
        },
    },
});

transTable.getData("http://localhost:4000/trans");
