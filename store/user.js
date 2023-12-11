document.addEventListener('alpine:init', () => {
  Alpine.data('_bookingApp', () => ({

      coupons: [
        'Promo123',
      ],

      past_bookings: [],

      favorites: [],

      loyality_points: 0,

      tab: 1,

      booking: {
          checkin: null,
          checkout: null,
          room_cost: 0,
          number_of_rooms: 0,
          number_of_adults: 0,
          number_of_children: 0,
          number_of_children_above_five: 0,
          nationality: null,
          extra_bed: 0,
          promo_code: null,

          // adventure
          adventure: {
              number_of_adults_local: 0,
              number_of_adults_foreign: 0,
              number_of_children_local: 0,
              number_of_children_foreign: 0,
              adult_guide: 0,
              child_guide: 0
          },

          customer: {
              name: null,
              email: null,
              phone: null,
              address: null,
              city: null,
              country: null,
              postal_code: null,

              // card details
              card_number: null,
              card_holder: null,
              expiry_date: null,
          },

          // final calculations
          total_cost: 0,
          discount_percentage: 0,
          total_discount: 0,
          final_total: 0,
          final_adventure_cost: 0
      },

      get total_adventure_cost() {
          let total = 0;
          total += this.booking.adventure.number_of_adults_local * 5000;
          total += this.booking.adventure.number_of_adults_foreign * 10000;
          total += this.booking.adventure.number_of_children_local * 2000;
          total += this.booking.adventure.number_of_children_foreign * 5000;
          total += this.booking.adventure.adult_guide * 1000;
          total += this.booking.adventure.child_guide * 500;
          this.booking.final_adventure_cost = total;
          return total;
      },

      get total_cost() {
          let total = 0;
          total += this.booking.room_cost * this.booking.number_of_rooms;
          total += this.booking.extra_bed * 8000;
          total+= this.booking.number_of_children_above_five * 5000;
          total += this.total_adventure_cost;
          this.booking.total_cost = total;

          // calculate discount
          this.booking.total_discount = total * (this.booking.discount_percentage / 100);

          // calculate final total
          this.booking.final_total = total - this.booking.total_discount;

          return total;
      },

      goToCheckAvailability() {
        this.tab = 2;
      },

      goToAdventures() {
        this.tab = 3;
      },

      goToCheckout() {
        this.tab = 4;

          // save the booking to localstorage
          localStorage.setItem('booking', JSON.stringify(this.booking));
      },

      completeBooking() {

          this.tab = 6;

        // Only award loyalty points if the number of rooms is greater than 3
        if (this.booking.number_of_rooms > 3) {
        // Award 20 loyalty points per room
        const loyaltyPointsEarned = 20 * this.booking.number_of_rooms;

        // Update loyalty points
        this.loyality_points += loyaltyPointsEarned;

        // Save the updated loyalty points to local storage
        localStorage.setItem('loyality_points', this.loyality_points);

        // Display a message to the user
        alert(`Congratulations! You have earned ${loyaltyPointsEarned} loyalty points.`);
    }
        // add a copy of the booking to past bookings
        this.past_bookings.push(JSON.parse(JSON.stringify(this.booking)));

        // save the past_bookings to local storage
        localStorage.setItem('past_bookings', JSON.stringify(this.past_bookings));

        // clear the booking
        this.clearBooking();

         // Show the booking confirmation alert
        alert('Congratulations! Your booking is confirmed.');

      },



      bookFavorite(index) {
          // clear the booking from localstorage
          localStorage.removeItem('booking');

          this.booking = this.favorites[index];
          
          this.tab = 1,2,3;
      },

      addToFavorites() {
          this.tab = 5;

             // Create a deep copy of the booking before pushing to favorites
            const copyOfBooking = JSON.parse(JSON.stringify(this.booking));
            this.favorites.push(copyOfBooking);

            // Save the favorites to local storage
            localStorage.setItem('favorites', JSON.stringify(this.favorites));

            // clear the booking
            this.clearBooking();
      },

      checkLoyaltyPoints() {
alert(`You have ${this.loyality_points} loyality points.`)

      },

      
      bookAdventure() {
        const adventureDetails = {
            numberOfAdultsLocal: this.booking.adventure.number_of_adults_local,
            numberOfChildrenLocal: this.booking.adventure.number_of_children_local,
            numberofAdultsForeign: this.booking.adventure.number_of_adults_foreign,
            numberofChildrenForeign: this.booking.adventure.number_of_children_foreign,
            numberofGuidesAdults: this.booking.adventure.adult_guide,
            numberofGuidesChildren: this.booking.adventure.child_guide,
          
        };

        

        alert(`Diving Adventure booked!\n\nDetails:\nNumber of Adults (Local): ${adventureDetails.numberOfAdultsLocal}\nNumber of Children (Local): ${adventureDetails.numberOfChildrenLocal}\nNumber of Adults (Foreign): ${adventureDetails.numberofAdultsForeign}\nNumber of Children (Foreign): ${adventureDetails.numberofChildrenForeign}\nNumber of Guides (Adults): ${adventureDetails.numberofGuidesAdults}\nNumber of Guides (Children): ${adventureDetails.numberofGuidesChildren}\n\nTotal Cost: ${this.total_adventure_cost.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}\n\nThank you for booking with us!`);
    },

    clearBooking() {
        this.booking = {
          checkin: null,
          checkout: null,
          room_cost: 0,
          number_of_rooms: 0,
          number_of_adults: 0,
          number_of_children: 0,
          number_of_children_above_five: 0,
          nationality: null,
          extra_bed: 0,
          promo_code: null,
          adventure: {
          number_of_adults_local: 0,
          number_of_adults_foreign: 0,
          number_of_children_local: 0,
          number_of_children_foreign: 0,
          adult_guide: 0,
          child_guide: 0
          },
          customer: {
            name: null,
            email: null,
            phone: null,
            address: null,
            city: null,
            country: null,
            postal_code: null,
            card_number: null,
            card_holder: null,
            expiry_date: null,
          },
          total_cost: 0,
          discount_percentage: 0,
          total_discount: 0,
          final_total: 0,
          final_adventure_cost: 0
        };
        localStorage.removeItem('booking');
      },

      init() {
          // set booking checkin date to today
          this.booking.checkin = new Date().toISOString().slice(0, 10);


          // watch booking.promo_code for changes and check if the code exists in the coupons array
          this.$watch('booking.promo_code', (value) => {
              if (this.coupons.includes(value)) {
                  // alert('Coupon Applied');
                  this.booking.discount_percentage = 5;
              } else {
                  this.booking.discount_percentage = 0;
              }
          });

         // check if there is a booking in local storage and load it
        const storedBooking = localStorage.getItem('booking');
        if (storedBooking) {
            this.booking = JSON.parse(storedBooking);
        }

        // check if there are past bookings in local storage and load them
        const storedPastBookings = localStorage.getItem('past_bookings');
        if (storedPastBookings) {
            this.past_bookings = JSON.parse(storedPastBookings);
        }

        // check if there are favorites in local storage and load them
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            this.favorites = JSON.parse(storedFavorites);
        }


          if (localStorage.getItem('loyality_points')) {
            this.loyality_points = parseInt(localStorage.getItem('loyality_points'));
        }

      }

  }));
})