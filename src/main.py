from datetime import datetime, timedelta, timezone

from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/')
def root():
    title = request.args.get('ti') or 'No data.'
    jst = timezone(timedelta(hours=+9), 'JST')
    now = datetime.now(jst)
    return render_template('index.html', title=title, date=now.strftime('%Y年%m月%d日 %H:%M:%S'))


if __name__ == "__main__":
    app.run(debug=True)
