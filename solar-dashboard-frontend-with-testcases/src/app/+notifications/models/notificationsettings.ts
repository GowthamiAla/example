/**
 * A model class to hold notification settings details
 */
export interface INotificationSettings {
  id: number;
  component_id: number;
  component: string;
  description: string;
  web_socket: number;
  email: number;
  mobile: number;
  wdisabled:boolean;
  emailStatus:boolean;
  webSocketStatus:boolean;
}