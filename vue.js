// Create a new Vue instance that controls the app
let webstore = new Vue({
    el: '#app',                    // Connects Vue to the HTML element with id="ap

    data: {
            lessons: lessonData,   // All lessons loaded from lessonData array
            cart: [],              // Array to store items added to the cart
            showCart: false,       // Controls whether the cart page is shown or the lesson page
            searchQuery: '',       // Stores the text entered in the search bar
            sortKey: '',           // Stores which property we want to sort by (price, subject, etc.)
            sortOrder: 'asc',      // Sort order: ascending ("asc") or descending ("desc")
            name: '',              // Customer name entered during checkout
            phone: '',             // Customer phone number entered during checkout
            checkoutMessage: '',   // Message shown after checkout is completed
            showPopup: false       // Controls visibility of the pop-up confirmation box
    },
    computed: {

        // Filter lessons based on search, then apply sorting
        filteredAndSorted() {

            // Filter lessons based on search input
            let filtered = this.lessons.filter(lesson =>
                lesson.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                lesson.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                lesson.price.toString().includes(this.searchQuery) ||
                lesson.spaces.toString().includes(this.searchQuery)
            );

            // Sorting logic if a sort key is chosen
            if (this.sortKey) {
                filtered.sort((a, b) => {

                    // If sorting text fields (like subject or location)
                    let result = typeof a[this.sortKey] === 'string'
                        ? a[this.sortKey].localeCompare(b[this.sortKey])

                        // If sorting numbers (like price or rating)
                        : a[this.sortKey] - b[this.sortKey];

                    // Return ascending or descending based on user choice
                    return this.sortOrder === 'asc' ? result : -result;
                });
            }
            return filtered;
        },

        // Returns the total number of items currently in the cart
        cartCount() {
            return this.cart.length;
        },

        // Calculates the total cost of all items in the cart
        totalPrice() {
            return this.cart.reduce((sum, item) => sum + item.price, 0);
        },

        // Check if checkout form is valid (name letters only, phone numbers only)
        canCheckout() {
            return /^[A-Za-z\s]+$/.test(this.name) &&     // name validation
                   /^[0-9]+$/.test(this.phone) &&         // phone validation
                   this.cart.length > 0;                  // must have items in cart
        }
    },
    methods: {

        // Add a lesson to the cart
        addToCart(lesson) {
            if (lesson.spaces > 0) {                      // Only add if spaces are available
                lesson.spaces--;                          // Reduce available spaces

                // Copy lesson to cart with a unique cart ID
                this.cart.push({ ...lesson, cartId: Date.now() + Math.random() });
            }
        },

        // Remove a lesson from the cart
        removeFromCart(item) {

            // Keep all items except the one being removed
            this.cart = this.cart.filter(l => l.cartId !== item.cartId);

            // Find the original lesson in the main lesson list and restore its space
            const foundLesson = this.lessons.find(l => l.id === item.id);
            if (foundLesson) foundLesson.spaces++;
        },

        // Toggle between "Lessons" view and "Cart" view
        toggleView() {
            this.showCart = !this.showCart;
        },

        // Submit checkout form and show thank-you message
        checkout() {
            this.checkoutMessage = `Hi ${this.name}, your order totaling £${this.totalPrice.toFixed(2)} has been submitted!`;

            // Clear the cart and form inputs    
            this.cart = [];
            this.name = '';
            this.phone = '';

            // Show confirmation popup
            this.showPopup = true;
        },

        // Close the success popup
        closePopup() {
            this.showPopup = false;
        }

    }
})
