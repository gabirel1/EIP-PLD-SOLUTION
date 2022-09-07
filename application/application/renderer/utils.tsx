export const showNotification = (message: string) => {
  const notification = new Notification('PLD Solution 🔔', {
    body: message,
  });
}