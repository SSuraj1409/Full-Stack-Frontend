// Create a new Vue instance that controls the app
let webstore = new Vue({
    el: '#app',                    // Connects Vue to the HTML element with id="ap

    data: {
            lessons: [],           // Holds all lessons retrieved from the backend
            cart: [],              // Array to store items added to the cart
            showCart: false,       // Controls whether the cart page is shown or the lesson page
            searchQuery: '',       // Stores the text entered in the search bar
            sortKey: '',           // Stores which property we want to sort by (price, subject, etc.)
            sortOrder: 'asc',      // Sort order: ascending ("asc") or descending ("desc")
            name: '',              // Customer name entered during checkout
            phone: '',             // Customer phone number entered during checkout
            checkoutMessage: '',   // Message shown after checkout is completed
            showPopup: false ,      // Controls visibility of the pop-up confirmation box
            searchTimeout: null,    // Used for delaying search input
            orderCompleted: false,  // Tracks whether checkout has finished
            nameError: '',          // Error message for name validation
            phoneError: '',         // Error message for phone validation

    },

    // Computed properties: auto-update based on data
    computed: {

        // Filter lessons based on search, then apply sorting
        filteredAndSorted() {
            let filtered = [...this.lessons];

            // Filter lessons based on search input
           if (this.searchQuery) {
                filtered = filtered.filter(lesson =>
                    lesson.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    lesson.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    lesson.price.toString().includes(this.searchQuery) ||
                    lesson.spaces.toString().includes(this.searchQuery)
                );
            }

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

        // Determines whether checkout button should be enabled
       canCheckout() {
            return this.cart.length > 0 &&
                   this.name.trim() !== '' &&
                   this.phone.trim() !== '' &&
                   !this.nameError &&
                   !this.phoneError;               
        }
    },

    // Methods: functions that run when triggered by user
    methods: {

        // Fetch lessons from backend on page load
       async fetchLessonsData() {
            try {
                this.lessons = await fetchLessons();
            } catch (err) {
                console.error("Failed to fetch lessons:", err);
            }
        },
        
        // Perform server-side search when user types in search bar
         async searchLessons() {
            if (!this.searchQuery) {
                this.fetchLessonsData();   // Reset to full list if search is cleared
                return;
            }
            try {
                this.lessons = await fetchSearch(this.searchQuery);
            } catch (err) {
                console.error("Search failed:", err);
            }
        },

        // Add small delay before searching (prevents spam requests)
        handleSearchInput() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.searchLessons();
            }, 300);
        },

        // Add a lesson to cart and reduce available spaces
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                lesson.spaces--;            // Reduce lesson availability
                this.cart.push({ ...lesson, cartId: Date.now() + Math.random() });  // Unique ID for cart item
            }
        },

        // Remove item from cart and restore spaces
        removeFromCart(item) {
            this.cart = this.cart.filter(l => l.cartId !== item.cartId);

            // Restore spaces in the main lesson list
            const foundLesson = this.lessons.find(l => l._id === item._id);
            if (foundLesson) foundLesson.spaces++;
        },

        // Switch between lesson view and cart view
        toggleView() {
            this.showCart = !this.showCart;
        },

        // Validate name (letters only)
        validateName() {
            if (this.name.trim() === '') {
                this.nameError = '';
                return false;
            }
            if (!/^[A-Za-z\s]+$/.test(this.name)) {
                this.nameError = "Name cannot contain numbers or special characters";
                return false;
            }
            this.nameError = '';
            return true;
        },

        // Validate phone (numbers only)
        validatePhone() {
            if (this.phone.trim() === '') {
                this.phoneError = '';
                return false;
            }
            if (!/^[0-9]+$/.test(this.phone)) {
                this.phoneError = "Phone can only contain numbers";
                return false;
            }
            this.phoneError = '';
            return true;
        },

        // Update name + validate as user types
        handleNameInput(event) {
            this.name = event.target.value;
            this.validateName();
        },

        // Update phone + validate as user types
        handlePhoneInput(event) {
            this.phone = event.target.value;
            this.validatePhone();
        },

        // Checkout process: send order + update lesson spaces
        async checkout() {

            // Prevent checkout if validation fails
            if (!this.validateName() || !this.validatePhone()) {
                alert("Please fix errors before submitting!");
                return;
            }

            // Build order object to send to backend
            const order = {
                name: this.name,
                phone: this.phone,
                lessonIDs: this.cart.map(l => l._id),
                quantities: this.cart.map(() => 1),
                totalPrice: this.totalPrice
            };

            try {

                // Send order to server
                await fetchOrder(order);

                // Update space count on server for each purchased lesson
                for (const lesson of this.cart) {
                    await fetchUpdateSpaces(lesson._id, lesson.spaces);
                }

                // Success message for the user
                this.checkoutMessage = `Hi ${this.name}, your order totaling £${this.totalPrice.toFixed(2)} has been submitted!`;

                // Clear fields + cart
                this.cart = []; 
                this.name = '';
                this.phone = '';
                this.nameError = '';
                this.phoneError = '';

                 // Show confirmation popup
                this.showPopup = true;
                this.orderCompleted = true;
            } catch (err) {
                console.error(err);
                alert("Failed to submit order. Please try again.");
            }
        },

        // Close the success popup
        closePopup() {
            this.showPopup = false;
        }
    },
    mounted() {
        this.fetchLessonsData();        // Load lessons from server when page opens
    }
});
