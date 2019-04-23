/**
 * Created by Administrator on 2017/5/2.
 */
//checkLogin: ���û���Ϣ��req.session.user�������ڣ�
// ����Ϊ�û�û�е�¼������ת����¼ҳ��ͬʱ��ʾ δ��¼ ��֪ͨ��������Ҫ�û���¼���ܲ�����ҳ�漰�ӿ�
//checkNotLogin: ���û���Ϣ��req.session.user�����ڣ�
// ����Ϊ�û��Ѿ���¼������ת��֮ǰ��ҳ�棬ͬʱ��ʾ �ѵ�¼ ��֪ͨ�����¼��ע��ҳ�漰��¼��ע��Ľӿ�
module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', 'δ��¼');
            return res.redirect('/signin');
        }
        next();
    },
    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '�ѵ�¼');
            return res.redirect('back');//����֮ǰ��ҳ��
        }
        next();
    }
};