
const ColorColumn = {
   props: ['color'],
   emits: ['update:color', 'delete'],
   setup(props, { emit }) {
      const hexInput = ref(props.color);
      const errorMessage = ref('');
      const copyButtonText = ref('Copy to Clipboard');
      const colorInput = ref(null);

      // Computed property for color picker value
      const colorInputValue = computed(() => expandShortHex(hexInput.value));

      // Sync hexInput with prop changes
      watch(() => props.color, (newColor) => {
         hexInput.value = newColor;
         errorMessage.value = '';
      });

      // Handle hex input changes
      const handleHexInput = () => {
         const hex = hexInput.value.trim();
         if (isValidHex(hex)) {
            emit('update:color', hex);
            errorMessage.value = '';
         } else if (hex === '') {
            errorMessage.value = '';
         } else {
            errorMessage.value = 'Invalid hex color';
         }
      };

      // Handle color picker changes
      const handleColorPicker = (event) => {
         const newColor = event.target.value;
         hexInput.value = newColor;
         emit('update:color', newColor);
         errorMessage.value = '';
      };

      // Copy hex value to clipboard
      const copyToClipboard = () => {
         navigator.clipboard.writeText(hexInput.value)
            .then(() => {
               copyButtonText.value = 'Copied!';
               setTimeout(() => {
                  copyButtonText.value = 'Copy to Clipboard';
               }, 1000);
            })
            .catch(err => {
               console.error('Failed to copy: ', err);
            });
      };

      // Open color picker
      const openColorPicker = () => {
         colorInput.value.click();
      };

      return {
         hexInput,
         errorMessage,
         copyButtonText,
         colorInput,
         colorInputValue,
         handleHexInput,
         handleColorPicker,
         copyToClipboard,
         openColorPicker,
         deleteColumn: () => emit('delete')
      };
   },
   template: `
       <div class="column">
           <div class="color-square">
               <div class="color-fill" :style="{ backgroundColor: color }"></div>
           </div>
           <div class="controls">
               <div class="button-group">
                   <button @click="openColorPicker">Change Colour</button>
                   <button @click="copyToClipboard">{{ copyButtonText }}</button>
               </div>
               <input v-model="hexInput" @input="handleHexInput" />
               <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
               <button @click="deleteColumn">Delete Column</button>
               <input type="color" :value="colorInputValue" ref="colorInput" @change="handleColorPicker" style="display: none;" />
           </div>
       </div>
   `
};