let initialized = false;

const init = async () => {
  if (initialized) {
    return
  }

  process.env.restaurants_api   = "https://ce0lr8gtji.execute-api.eu-west-1.amazonaws.com/dev/restaurants";
  process.env.restaurants_table = "restaurants-dev-rami";
  process.env.AWS_REGION        = "eu-west-1";
  process.env.order_events_stream = 'orders-dev-rami';
  process.env.restaurant_notification_topic = 'restaurants-dev-rami';
  process.env.TEST_ROOT = "https://ce0lr8gtji.execute-api.eu-west-1.amazonaws.com/dev";

  initialized = true
}

module.exports = {
  init
}