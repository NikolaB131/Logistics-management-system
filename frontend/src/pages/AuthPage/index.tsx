import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login, register } from '../../redux/slices/auth/thunks';
import { useAppDispatch } from '../../redux/utils';
import Button from '../../shared/Button';
import TextInput from '../../shared/TextInput';
import styles from './AuthPage.module.css';
import Tabs from './Tabs';

const AuthPage = () => {
  const dispatch = useAppDispatch();

  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [isLeftTabSelected]);

  const onButtonClick = async () => {
    if (isLeftTabSelected) {
      await dispatch(login({ email, password }));
      navigate('/');
    } else {
      await dispatch(register({ email, password }));
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.form_container}>
        <Tabs
          leftText="Вход"
          rightText="Регистрация"
          isLeftTabSelected={isLeftTabSelected}
          onTabSelect={setIsLeftTabSelected}
        />
        <TextInput
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextInput type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
        <Button onClick={onButtonClick}>{isLeftTabSelected ? 'Войти' : 'Зарегистрироваться'}</Button>
      </section>
    </div>
  );
};

export default AuthPage;
