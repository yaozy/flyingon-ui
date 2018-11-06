flyingon.widget({

    template: {

        Class: 'Plugin',
        padding: 8,
        layout: 'vertical-line',

        children: [

            {
                Class: 'Grid',
                width: 780,
                height: 240,
                header: 80,

                columns: [

                    { 
                        title: [
                            { text: 'F1234', size: 35 },
                            { text: 'F12', merge: true },
                            'F1'
                        ]
                    },

                    { 
                        title: [
                            { text: 'F1234', size: 35, merge: true },
                            { text: 'F12', merge: true },
                            'F2'
                        ]
                    },

                    { 
                        title: [
                            { text: 'F1234' , size: 35, merge: true },
                            { text: 'F34', merge: true },
                            'F3'
                        ]
                    },

                    { 
                        title: [
                            { text: 'F1234' , size: 35, merge: true },
                            { text: 'F34', merge: true },
                            'F4'
                        ]
                    },

                    { 
                        title: [
                            { text: 'F5', size: 35 },
                            { text: 'F56', merge: true },
                            { text: 'F5678', merge: true }
                        ]
                    },

                    { 
                        title: [
                            { text: 'F6', size: 35 },
                            { text: 'F56', merge: true },
                            { text: 'F5678', merge: true }
                        ]
                    },

                    { 
                        title: [
                            { text: 'F7', size: 35 },
                            { text: 'F78', merge: true },
                            { text: 'F5678', merge: true }
                        ] 
                    },

                    { 
                        title: [
                            { text: 'F8', size: 35 },
                            { text: 'F78', merge: true },
                            { text: 'F5678', merge: true }
                        ]
                    }
                ]
            },
            
            { Class: 'Code' }

        ]
    },

    created: function () {

    }


});