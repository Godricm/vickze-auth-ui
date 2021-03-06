import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RoleSelect from '@/pages/Role/RoleSelect';


const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/fetchById'],
  submitting: loading.effects['user/submitForm'],
}))
@Form.create()
class UserForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //prop.id modal传进来的， (props.match && props.match.params.id) url 上的
      id: props.id || (props.match && props.match.params.id),
      data: {},
      duplicate: props.duplicate || (props.match && props.match.params.duplicate),
      show: true,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;

    const { id } = this.state;
    if (id) {
      dispatch({
        type: 'user/fetchById',
        payload: id,
        callback: (response) => {
          this.setState({
            data: response || {},
          });
        }
      });
    }
  }

  handleCancel = () => {
    this.setState({
      show: false,
    })
  }

  handleReturn = () => {
    router.push(`/user/user-list`);
  };

  handleSubmit = e => {
    const {
      dispatch,
      form,
    } = this.props;
    const { duplicate } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (duplicate) {
          delete values.id;
        }
        dispatch({
          type: 'user/submitForm',
          payload: values,
          callback: (response) => {
            const {
              afterClose,
              queryList,
              user: {
                pagination, queryParams
              },
            } = this.props;

            if (afterClose) {
              this.handleCancel();
              queryList(pagination, queryParams);
            } else {
              this.handleReturn();
            }
          },
        });
      }
    });
  };

  renderFooter = () => {
    const { submitting } = this.props;
    return [
      <Button key="submit" type="primary" htmlType="submit" loading={submitting} onClick={this.handleSubmit}>
        <FormattedMessage id="form.submit" />
      </Button>,
      <Button key="cancel" style={{ marginLeft: 8 }} onClick={this.handleCancel}>
        <FormattedMessage id="form.cancel" />
      </Button>
    ];
  }

  checkRole = (rule, value, callback) => {
    callback();
    // if (value && value.length > 0) {
    //   callback();
    //   return;
    // }
    // callback(formatMessage({ id: 'validation.user.role' }));
  };

  render() {
    const {
      loading,
      submitting,
      form: { getFieldDecorator, getFieldValue },
      afterClose,
    } = this.props;


    const { id, data, duplicate, show } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      //
      afterClose ?
        <Modal
          width={640}
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          title={!id || duplicate ? <FormattedMessage id="app.user.add.title" /> : <FormattedMessage id="app.user.edit.title" />}
          visible={show}
          footer={this.renderFooter()}
          onCancel={this.handleCancel}
          afterClose={() => afterClose()}
        >
          <Card bordered={false} loading={loading}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
              {getFieldDecorator('id', { initialValue: data.id })
                (<Input hidden />)}
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.username" />}>
                {getFieldDecorator('username', {
                  initialValue: data.username,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.user.username' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.user.username.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.password" />}>
                {getFieldDecorator('password', {
                  initialValue: data.password,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.user.password' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.user.password.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.email" />}>
                {getFieldDecorator('email', {
                  initialValue: data.email,
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.user.email' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.user.email.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.mobile" />}>
                {getFieldDecorator('mobile', {
                  initialValue: data.mobile,
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.user.mobile' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.user.mobile.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.role" />}>
                {getFieldDecorator('roles', {
                  initialValue: data.roles,
                  rules: [{ validator: this.checkRole }],
                })(<RoleSelect placeholder={formatMessage({ id: 'app.user.role.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.status" />}>
                {getFieldDecorator('status', {
                  initialValue: data.status === undefined ? "1" : data.status.toString(),
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.user.status' }),
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value="1">正常</Radio>
                    <Radio value="0">禁用</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Form>
          </Card>
        </Modal>
        :
        <PageHeaderWrapper title={!id || duplicate ? <FormattedMessage id="app.user.add.title" /> : <FormattedMessage id="app.user.edit.title" />}>
          <Card bordered={false} loading={loading}>
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              {getFieldDecorator('id', { initialValue: data.id })
                (<Input hidden />)}
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.username" />}>
                {getFieldDecorator('username', {
                  initialValue: data.username,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.user.username' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.user.username.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.password" />}>
                {getFieldDecorator('password', {
                  initialValue: data.password,
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.user.password' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.user.password.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.email" />}>
                {getFieldDecorator('email', {
                  initialValue: data.email,
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.user.email' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.user.email.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.mobile" />}>
                {getFieldDecorator('mobile', {
                  initialValue: data.mobile,
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.user.mobile' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.user.mobile.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.role" />}>
                {getFieldDecorator('roles', {
                  initialValue: data.roles,
                  rules: [{ validator: this.checkRole }],
                })(<RoleSelect placeholder={formatMessage({ id: 'app.user.role.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.user.status" />}>
                {getFieldDecorator('status', {
                  initialValue: data.status === undefined ? "1" : data.status.toString(),
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.user.status' }),
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value="1">正常</Radio>
                    <Radio value="0">禁用</Radio>
                  </Radio.Group>
                )}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  <FormattedMessage id="form.submit" />
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReturn}>
                  <FormattedMessage id="form.return" />
                </Button>
              </FormItem>
            </Form>
          </Card>
        </PageHeaderWrapper>
    );
  }
}

export default UserForm;
