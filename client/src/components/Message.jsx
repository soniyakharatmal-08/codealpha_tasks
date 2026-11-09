function Message({ type, children }) {
  if (!children) {
    return null;
  }

  return (
    <p className={`message ${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

export default Message;
