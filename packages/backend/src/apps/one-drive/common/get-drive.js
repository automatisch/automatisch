const getDrive = async ($) => {
  const { data: drive } = await $.http.get(
    '/me/drive'
  );
  return drive;
};

export default getDrive;