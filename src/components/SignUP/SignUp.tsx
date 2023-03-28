import { Button } from '../Button';
import { db } from '@/firebase/app';
import { Input } from '../Input/Input';
import { auth } from '@/firebase/auth';
import classes from './SignUp.module.scss';
import { FormEvent, useState } from 'react';
import { doc, setDoc } from '@firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { isValidEmail, isValidPw } from '../../utils/validation';
import { getStorage, ref, getDownloadURL } from '@firebase/storage';
import { LogoIconandText } from '../LogoIconandText/LogoIconandText';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';

export default function SignUp() {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const inputProps = {
    maxWidthValue: '300px',
    heightValue: '45px',
    isA11yHidden: true,
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const passwordConfirm = e.target[3].value;
    const phoneNumber = '* 전화번호를 입력하세요.';
    const address = '* 주소를 입력하세요.';

    // validation ---------------------------------------------------
    if (!displayName || displayName.trim().length < 2) {
      alert('이름은 2글자 이상 입력해야 해요');
      return;
    }

    if (!isValidEmail(email)) {
      alert('이메일 형식으로 입력해 주세요.');
      return;
    }

    if (!isValidPw(password)) {
      alert('영문, 숫자 혼합하여 8자리 이상 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 같지 않습니다.');
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const defaultImageRef = ref(getStorage(), 'chatAvatars.svg');
      const defaultImageUrl = await getDownloadURL(defaultImageRef);
      await updateProfile(res.user, {
        displayName,
        photoURL: defaultImageUrl,
      });

      //create user on firestore
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        phoneNumber,
        address,
        password: password,
        photoURL: defaultImageUrl,
      });

      alert('회원가입이 완료되었습니다.');

      navigate('/mainPage');
    } catch (err) {
      setErr(err);
    }
  };

  return (
    <div className={classes.formContainer}>
      <div className={classes.formWrapper}>
        <LogoIconandText small={false} />
        <form onSubmit={handleSubmit} className={classes['signUpForm']}>
          <Input
            type={'name'}
            labelText={'이름'}
            placeHolder={'이름을 입력하세요.'}
            {...inputProps}
          />

          <Input
            type={'email'}
            labelText={'이메일'}
            placeHolder={'이메일을 입력하세요.'}
            {...inputProps}
          />

          <Input
            type={'password'}
            labelText={'비밀번호'}
            placeHolder={'비밀번호를 입력하세요.'}
            {...inputProps}
          />
          <Input
            type={'password'}
            labelText={'비밀번호 확인'}
            placeHolder={'비밀번호를 한번 더 입력하세요.'}
            {...inputProps}
          />

          <Button
            backgroundColor={'orange'}
            isSmall={false}
            maxWidthValue={'300px'}
            heightValue={'45'}
            colorValue={'black'}
            text={'회원가입'}
            type={'submit'}
          />
          {err && (
            <span className={classes.error}>🚫 다시 입력해 주세요 🚫</span>
          )}
        </form>
        <p>
          <Link to={'/'}>
            <span className={classes.login}>로그인 {''}</span>
          </Link>
          계정이 있으신가요?
        </p>
      </div>
    </div>
  );
}
