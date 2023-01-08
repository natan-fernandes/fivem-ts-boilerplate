export const sendNuiMessage = (type: string, data: any) => 
  SendNuiMessage(JSON.stringify({type: type, value: data}));
