define(['backbone', 'react', 'reactdom', 'input', 'textModel', 'visualization'],
    (Backbone, React, ReactDOM, Input, TextModel, Visualization) => {
    
    /**
     * Main Container View
     */
    var MainView = Backbone.View.extend({
      el: '.container',
      
      initialize: function() {
        // Init text model
        this.textModel = new TextModel();

        // Listen to changes in model
        this.listenTo(this.textModel, 'change:text', this.textChanged);
        
        // Render textarea        
        ReactDOM.render(<Input model={this.textModel} />,
          document.getElementById('data-input'));

        // console.log(this.$el.width());

        // Render initial visualization
        ReactDOM.render(<Visualization 
                          width={$('#data-display').width()}
                          height={$('#data-display').height()}
                          mainView={this} />,
                          document.getElementById('data-display'));
      },

      /**
       * Whenever the user changes the input the visualization
       * is triggered anew
       */
      textChanged: function() {
        // Get text and split it into an array of characters
        // Lowercase characters so that case doesn't matter
        let text = this.textModel.get('text')
            .toLowerCase()
            // .replace(/[.,\/# !\d+$%\^&\*;:{}=\-_`~()]/g,"")
            .replace(/[^a-z]+/g, '')
            .split('');

        // Count number of occurences of characters in string
        // The count is passed to the d3 visualization so that it 
        // can enter and update new data
        let countCharacter = text.reduce((countMap, character) => {
            countMap[character] = ++countMap[character] || 1
            return countMap;
        }, {});

        // Regenerate data
        var newData = [];
        for (let key in countCharacter) {
          let numberArray = Array.apply(null,
            {length: countCharacter[key]}).map(Number.call, Number);

          // Add 1 to every element in array
          numberArray = numberArray.map((e) => {
            return e + 1;
          }).map((e) => {
            // Generate simple id for enter selection in
            // d3
            let id = key + e;
            newData.push([key, e, id]);
          });
        }

        // Set dict with character count to model and update
        this.textModel.set('charDict', newData)
      }
    });

    return MainView;
});
