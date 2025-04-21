export interface SignUpResponseDto {
    sessionId: string;
    loginId: string;
}

export interface SignUpRequestDto {
    loginId: string;
    password: string;
}
