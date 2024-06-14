import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../shared/Button';
import TextInput from '../../shared/TextInput';
import styles from './AuthPage.module.css';
import Tabs from './Tabs';

const AuthPage = () => {
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const loginAndRedirect = async (username: string, password: string) => {
  //   await dispatch(login({ username, password }));
  //   const checkLogin = await dispatch(check()).unwrap();
  //   if (checkLogin.ok) {
  //     navigate('/home');
  //   }
  // };

  const navigate = useNavigate();

  const onButtonClick = () => {
    if (isLeftTabSelected) {
      navigate('/');
      // loginAndRedirect(username, password);
    } else {
      // await dispatch(register({ username, password }));
      // loginAndRedirect(username, password);
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
