class ApplicationController < ActionController::API
  SECRET_KEY = Rails.application.secrets.secret_key_base.to_s

#   encodes a token
  def encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

#   decodes a token
  def decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new decoded
  end

#   create a user and sends data back to client without the pwd_digest
  def create
    @user = User.new(user_params)     
    if @user.save
        @token = encode({id: @user.id})
        render json: {
            user: @user.attributes.except("password_digest"),
            token: @token
        }, status: :created
    else
        render json: @user.errors, status: :unprocessable_entity
    end
  end

#   authenticate requests from those who that have logged in via header of request
  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      @decoded = decode(header) 
      @current_user = User.find(@decoded[:id]) 
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: e.message }, status: :unauthorized
    end
  end
end