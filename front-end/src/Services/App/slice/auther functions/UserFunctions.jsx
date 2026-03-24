import { useSelector } from 'react-redux';

export const findUser = (id) => {
    const { users } = useSelector((state) => state.user);

  return users.filter((u) => u.id !== id);
};


