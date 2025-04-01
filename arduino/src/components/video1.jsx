import { SerialPort } from 'serialport';

function SerialPortComponent() {
  React.useEffect(() => {
    SerialPort.list().then((ports) => {
      console.log('Available ports:', ports);
    }).catch((err) => {
      console.error('Error listing ports:', err);
    });
  }, []);

  return (
    <div>
      <p>Check the console for available ports.</p>
    </div>
  );
}

export default SerialPortComponent;