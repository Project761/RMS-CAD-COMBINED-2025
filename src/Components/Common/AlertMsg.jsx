import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const toastifySuccess = (message) => {
  toast.success(`${message}`, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}

export const toastifyError = (message) => {
  toast.error(`${message}`, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}


export const toastifyInfo = (message) => {
  toast.info(`${message}`, {
    position: "bottom-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}


export const showNotification = () => {
  toast.info(
    <div>
      <h4>Notification Title</h4>
      <p>This is the description of your notification.</p>
    </div>,
    {
      position: "top-right", // Optional: customize position
      autoClose: 5000,      // Optional: auto close after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );
};


const CustomToast = ({ title, description, priorityColor }) => (
  <div style={{ 
    padding: '12px 16px', 
    color: '#000', 
    display: 'flex', 
    alignItems: 'flex-start',
    gap: '12px'
  }}>
    <div 
      style={{ 
        width: '10px', 
        height: '10px', 
        backgroundColor: priorityColor || '#007bff',
        borderRadius: '50%',
        marginLeft: '-15px',
        marginTop: '-11px',
      }} 
    />
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  </div>
);

export const showNotificationToast = (title, description, priorityColor) => {
  toast(<CustomToast title={title} description={description} priorityColor={priorityColor} />, {
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    hideProgressBar: true,
    icon: false,
    closeButton: false,
    style: {
      background: '#fff',
      color: '#000',
      borderRadius: '6px',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bodyStyle: {
      padding: '0 0 0 0',
      margin: 0,
    },
  });
};
