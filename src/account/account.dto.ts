import { TokenData } from '../shared/@types/account.types';

export interface SignUpResponseDto {
    sessionId: string;
    loginId: string;
}

export interface SignUpRequestDto {
    loginId: string;
    password: string;
}

export interface SignInResponseDto extends SignUpResponseDto {}

export interface SignInRequestDto extends Pick<SignUpRequestDto, 'loginId' | 'password'> {}

export interface SignOutRequestDto {
    sessionId: string;
    tokenData: TokenData;
    password: string;
}
