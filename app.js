// Declare Vue utilities globally once
const { createApp, ref, computed, watch } = Vue;

// Helper Functions
function getRandomColor() {
   return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function isValidHex(hex) {
   return /^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(hex);
}

function expandShortHex(hex) {
   if (hex.length === 4) {
      const r = hex[1];
      const g = hex[2];
      const b = hex[3];
      return `#${r}${r}${g}${g}${b}${b}`;
   }
   return hex;
}

// Main Application
const app = createApp({
   setup() {
      // Initialize with 6 random colors
      const colors = ref(Array.from({ length: 6 }, getRandomColor));

      // Add a new column
      const addColumn = () => {
         colors.value.push(getRandomColor());
      };

      // Update a color at a specific index
      const updateColor = (index, newColor) => {
         colors.value[index] = newColor;
      };

      // Delete a column at a specific index
      const deleteColumn = (index) => {
         colors.value.splice(index, 1);
      };

      // Two-way computed property for the color array string
      const colorArrayString = computed({
         get() {
            return JSON.stringify(colors.value);
         },
         set(newValue) {
            try {
               const newColors = JSON.parse(newValue);
               if (Array.isArray(newColors) && newColors.every(isValidHex)) {
                  colors.value = newColors;
               } else {
                  throw new Error('Invalid array or hex colors');
               }
            } catch (e) {
               console.error('Invalid input:', e.message);
            }
         }
      });

      return {
         colors,
         addColumn,
         updateColor,
         deleteColumn,
         colorArrayString
      };
   }
});

// Register the ColorColumn component (defined in color-column.js)
app.component('color-column', ColorColumn);

// Mount the app
app.mount('#app');