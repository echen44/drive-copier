from database import db


class User(db.Model):
    sub = db.Column(db.String(255), primary_key=True)
    access_token = db.Column(db.String())
    expires_at = db.Column(db.Integer())
    refresh_token = db.Column(db.String())

    def __repr__(self):
        return '<User {}>'.format(self.sub)

    @staticmethod
    def create(sub, access_token, expires_at, refresh_token):
        user = User(sub=sub, access_token=access_token, expires_at=expires_at, refresh_token=refresh_token)
        db.session.add(user)
        db.session.commit()
        return User.get(sub)

    @staticmethod
    def get(sub):
        query = db.session.query(User).filter_by(sub=sub)
        return query.first()

    @staticmethod
    def update_token(sub, access_token, expires_at, refresh_token=None):
        if refresh_token:
            db.session.query(User).filter_by(sub=sub).update({
                "access_token": access_token,
                "expires_at": expires_at,
                "refresh_token": refresh_token
            })
        else:
            db.session.query(User).filter_by(sub=sub).update({
                "access_token": access_token,
                "expires_at": expires_at
            })
        db.session.commit()
        return User.get(sub)
