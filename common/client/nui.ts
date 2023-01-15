export const sendNuiMessage = (action: string, data: any) => 
  SendNuiMessage(JSON.stringify({action: action, data: data}));
