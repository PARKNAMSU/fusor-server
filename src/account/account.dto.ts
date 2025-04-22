export interface SignUpResponseDto {
    sessionId: string;
    loginId: string;
}

export interface SignUpRequestDto {
    loginId: string;
    password: string;
}

export interface SignInResonseDto extends SignUpRequestDto {}

export interface SignInRequestDto extends Pick<SignUpRequestDto, 'loginId' | 'password'> {}
