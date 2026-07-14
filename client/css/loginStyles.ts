import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 14, 0.25)',
  },
  leftSection: {
    flex: 1.1,
  },
  verticalDivider: {
    width: 1.5,
    height: '65%',
    backgroundColor: 'rgba(197, 3, 55, 0.45)',
    alignSelf: 'center',
  },
  rightSection: {
    justifyContent: 'center',
  },
  keyboardView: {
    width: '100%',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loginTitle: {
    fontSize: 34,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  errorText: {
    color: '#ff453a',
    fontSize: 13,
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  inputCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
        WebkitBoxShadow: '0 0 0px 1000px #ffffff inset' as any,
        transition: 'background-color 5000s ease-in-out 0s' as any,
        WebkitTextFillColor: '#0f172a' as any,
      },
    }),
  },
  eyeIcon: {
    padding: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    paddingHorizontal: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#C50337',
    borderColor: '#C50337',
  },
  checkboxLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
  },
  forgotText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
  },
  loginButton: {
    backgroundColor: '#C50337',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonArrow: {
    marginLeft: 6,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  googleCircleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 28,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  linkText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#C50337',
    textDecorationLine: 'underline',
  },
});

export default styles;
