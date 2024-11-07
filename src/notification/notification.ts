export default interface UserNotification {
  notify(): Promise<boolean>;
}
