import classes from './Button.module.scss';
import kakao from '/public/assets/kakaoLogo.svg';

interface Props {
  text: '로그인' | '회원가입';
  widthValue?: string | number;
  maxWidthValue?: string | number;
  heightValue?: string | number;
}

export function ButtonKakao({
  text,
  widthValue,
  maxWidthValue,
  heightValue,
}: Props) {
  const buttonStyle = {
    width: widthValue,
    maxWidth: maxWidthValue,
    height: heightValue,
  };

  const handleKakaoSignUp = () => {
    console.log('handleKakaoSignUp');
  };

  const handleKakaoSignIn = () => {
    console.log('handleKakaoSignIn');
  };

  return (
    <button
      type="button"
      aria-label={'Kakao' + text + '버튼'}
      className={classes.button}
      style={buttonStyle}
      onClick={text === '회원가입' ? handleKakaoSignUp : handleKakaoSignIn}
    >
      <img src={kakao} alt="Kakao 로고 이미지" />
      Kakao {text}
    </button>
  );
}
